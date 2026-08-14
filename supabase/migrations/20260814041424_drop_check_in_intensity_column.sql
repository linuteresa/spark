-- check_in.intensity was a 1-5 "how intense is this feeling" question from
-- the original spec. The redesigned check-in flow (checkin_flow_v2_schema)
-- never asks it -- the frontend was just feeding energy_level (1-3) into
-- both p_intensity and p_energy_level to satisfy the NOT NULL constraint,
-- so the column no longer measured anything real. Dropping it and updating
-- the RPC signature to match (parameter count changed, so this drops and
-- recreates the function rather than create-or-replace).

drop function if exists public.submit_check_in_and_assign(text, smallint, smallint, text, text, text);

alter table check_in drop column intensity;

create function public.submit_check_in_and_assign(
  p_emotion text,
  p_energy_level smallint,
  p_pillar text,
  p_substressor_code text,
  p_context text default null
)
returns table (assignment_id uuid, action_text text, for_date date)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := current_date;
  v_action_id uuid;
  v_assignment_id uuid;
begin
  if v_user_id is null then
    raise exception 'must be authenticated';
  end if;

  insert into check_in (user_id, emotion, context, energy_level, pillar, substressor_code)
  values (v_user_id, p_emotion, p_context, p_energy_level, p_pillar, p_substressor_code);

  select id into v_action_id
  from action_matrix
  where substressor_code = p_substressor_code and energy_level = p_energy_level;

  if v_action_id is null then
    raise exception 'no matching action for substressor % at energy level %', p_substressor_code, p_energy_level;
  end if;

  select id into v_assignment_id
  from challenge_assignment c
  where c.user_id = v_user_id and c.for_date = v_today;

  if v_assignment_id is null then
    insert into challenge_assignment (user_id, action_matrix_id, for_date, rank, reason)
    values (v_user_id, v_action_id, v_today, 1, 'Matched from check-in')
    returning id into v_assignment_id;
  else
    update challenge_assignment
    set action_matrix_id = v_action_id
    where id = v_assignment_id and completed_at is null and skipped_at is null;
  end if;

  insert into points_ledger (user_id, source, amount)
  values (v_user_id, 'daily_check_in', 10);

  return query
  select a.id, am.action_text, a.for_date
  from challenge_assignment a
  join action_matrix am on am.id = a.action_matrix_id
  where a.id = v_assignment_id;
end;
$$;

grant execute on function public.submit_check_in_and_assign(text, smallint, text, text, text) to authenticated;
revoke execute on function public.submit_check_in_and_assign(text, smallint, text, text, text) from public, anon;
