-- TEMPORARY STAND-IN. The real design (see docs/api-contract.md, Recharge
-- section) is a nightly service-role job that populates challenge_assignment
-- using the feeling -> task mapping (EPIC 1, still blocked on Princess as of
-- this migration). That job does not exist yet, so without something here
-- the Recharge tab has nothing to show for any real (non-seed) student.
--
-- This RPC is a synchronous, on-demand fallback: called from the Recharge
-- screen, it creates today's 2 assignments the first time a student opens
-- the tab that day (picking by focus-area weight if onboarding is done,
-- otherwise the 2 lowest-rung challenges), then is a no-op on every later
-- call the same day. Replace/remove this once the real mapping-driven job
-- ships -- do not build more logic on top of it.

create or replace function public.ensure_todays_assignments()
returns table (
  id uuid,
  challenge_id uuid,
  for_date date,
  rank smallint,
  reason text,
  completed_at timestamptz,
  skipped_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := current_date;
  v_count int;
begin
  if v_user_id is null then
    raise exception 'must be authenticated';
  end if;

  select count(*) into v_count
  from challenge_assignment
  where user_id = v_user_id and for_date = v_today;

  if v_count = 0 then
    insert into challenge_assignment (user_id, challenge_id, for_date, rank, reason)
    select
      v_user_id,
      c.id,
      v_today,
      row_number() over (order by coalesce(uf.weight, 0) desc, c.rung asc, c.id),
      'Placeholder pick -- feeling-to-task mapping (EPIC 1) not yet live'
    from challenges c
    left join user_focus uf on uf.focus_area_id = c.focus_area_id and uf.user_id = v_user_id
    order by coalesce(uf.weight, 0) desc, c.rung asc, c.id
    limit 2;
  end if;

  return query
  select a.id, a.challenge_id, a.for_date, a.rank, a.reason, a.completed_at, a.skipped_at
  from challenge_assignment a
  where a.user_id = v_user_id and a.for_date = v_today
  order by a.rank;
end;
$$;

grant execute on function public.ensure_todays_assignments() to authenticated;
revoke execute on function public.ensure_todays_assignments() from public, anon;
