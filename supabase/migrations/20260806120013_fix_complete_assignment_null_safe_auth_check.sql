-- The previous fix (20260806120012_security_hardening_function_grants)
-- still had a hole: `v_user_id <> auth.uid()` evaluates to NULL, not
-- TRUE, when auth.uid() is NULL (anon/no session), and `TRUE AND NULL`
-- is NULL -- which PL/pgSQL's IF treats as not-true, so the RAISE
-- EXCEPTION never ran and an anonymous caller could still complete any
-- assignment. Fixed with IS DISTINCT FROM, which is NULL-safe: it
-- returns TRUE whenever the two sides differ, including when one side
-- is NULL and the other isn't.
--
-- Verified directly against the hosted project: a call with no JWT
-- claims set (auth.uid() = NULL, matching a real anonymous request) now
-- raises "not authorized to complete this assignment" instead of
-- silently succeeding.

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
  values (v_user_id, 'challenge_completion', 10);

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
