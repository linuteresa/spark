-- Real check-in flow, replacing the earlier ensure_todays_assignments
-- placeholder now that the action matrix data exists (see
-- 20260813120017/20260813120018). One RPC, atomic: records the check-in
-- and resolves it straight to today's single matched action via
-- (substressor_code, energy_level) -> action_matrix.
--
-- Point value for a daily check-in is not specified in the design assets
-- (redacted in the point-breakdown screenshot); using 10 to match the only
-- precedent available (original spec's "Daily Check-In: 10 pts, Baseline").

create or replace function public.submit_check_in_and_assign(
  p_emotion text,
  p_intensity smallint,
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

  insert into check_in (user_id, emotion, intensity, context, energy_level, pillar, substressor_code)
  values (v_user_id, p_emotion, p_intensity, p_context, p_energy_level, p_pillar, p_substressor_code);

  select id into v_action_id
  from action_matrix
  where substressor_code = p_substressor_code and energy_level = p_energy_level;

  if v_action_id is null then
    raise exception 'no matching action for substressor % at energy level %', p_substressor_code, p_energy_level;
  end if;

  select id into v_assignment_id
  from challenge_assignment
  where user_id = v_user_id and for_date = v_today;

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

grant execute on function public.submit_check_in_and_assign(text, smallint, smallint, text, text, text) to authenticated;
revoke execute on function public.submit_check_in_and_assign(text, smallint, smallint, text, text, text) from public, anon;

drop function if exists public.ensure_todays_assignments();

create or replace function public.complete_assignment(p_assignment_id uuid)
returns table (current_streak smallint, longest_streak smallint, total_points bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_today date := current_date;
  v_caller_role text := coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
begin
  select user_id into v_user_id
  from challenge_assignment
  where id = p_assignment_id
  for update;

  if v_user_id is null then
    raise exception 'assignment not found';
  end if;

  if v_caller_role <> 'service_role' and v_user_id is distinct from auth.uid() then
    raise exception 'not authorized to complete this assignment';
  end if;

  update challenge_assignment
  set completed_at = now()
  where id = p_assignment_id and completed_at is null;

  if not found then
    raise exception 'assignment already completed or already skipped';
  end if;

  insert into points_ledger (user_id, source, amount)
  values (v_user_id, 'challenge_completion', 30);

  insert into streak (user_id, current_count, longest, last_date)
  values (v_user_id, 1, 1, v_today)
  on conflict (user_id) do update
  set
    current_count = case
      when streak.last_date = v_today then streak.current_count
      when streak.last_date = v_today - 1 then streak.current_count + 1
      else 1
    end,
    longest = greatest(
      streak.longest,
      case
        when streak.last_date = v_today then streak.current_count
        when streak.last_date = v_today - 1 then streak.current_count + 1
        else 1
      end
    ),
    last_date = v_today;

  return query
  select s.current_count, s.longest, (select coalesce(sum(amount), 0) from points_ledger where user_id = v_user_id)
  from streak s
  where s.user_id = v_user_id;
end;
$$;
