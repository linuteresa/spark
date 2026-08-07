-- Security hardening per Supabase Security Advisor.
--
-- 1. restrict_signup_to_umd_domain had a mutable search_path.
-- 2. Every SECURITY DEFINER function here relied on Postgres's default
--    PUBLIC execute grant -- anon could call all of them even though only
--    authenticated was ever meant to.
-- 3. complete_assignment() treated "auth.uid() is null" as proof of a
--    trusted service_role caller, but that's equally true of an anonymous
--    caller. Combined with #2, an unauthenticated request to
--    /rest/v1/rpc/complete_assignment could complete and award points for
--    ANY assignment_id, for ANY user. Fixed independently of the grant
--    revocation below, so a future re-grant can't reopen this hole.

alter function public.restrict_signup_to_umd_domain(jsonb) set search_path = public;

revoke execute on function public.current_school_id() from public, anon;
revoke execute on function public.complete_assignment(uuid) from public, anon;
revoke execute on function public.reflect_assignment(uuid, smallint, smallint, text, text) from public, anon;
revoke execute on function public.skip_assignment(uuid) from public, anon;

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

  -- Only a genuine service_role caller (seed scripts, an eventual nightly
  -- job) may act on someone else's assignment; every other caller,
  -- including one with no session at all, must own the row.
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

grant execute on function public.current_school_id() to authenticated;
grant execute on function public.complete_assignment(uuid) to authenticated;
grant execute on function public.reflect_assignment(uuid, smallint, smallint, text, text) to authenticated;
grant execute on function public.skip_assignment(uuid) to authenticated;
