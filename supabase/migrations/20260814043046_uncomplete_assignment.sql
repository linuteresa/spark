-- Home checkbox needs to be toggleable (users can mis-tap complete), so
-- add the reverse of complete_assignment(). Reverses completed_at and the
-- matching points_ledger row; streak is intentionally left untouched --
-- its upsert logic in complete_assignment() is already idempotent per
-- (user, day) via last_date, so re-completing after an uncomplete on the
-- same day doesn't double-count and there's nothing to undo there.

create function public.uncomplete_assignment(p_assignment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_completed_at timestamptz;
begin
  select user_id, completed_at into v_user_id, v_completed_at
  from challenge_assignment
  where id = p_assignment_id
  for update;

  if v_user_id is null then
    raise exception 'assignment not found';
  end if;

  if v_user_id is distinct from auth.uid() then
    raise exception 'not authorized to modify this assignment';
  end if;

  if v_completed_at is null then
    raise exception 'assignment is not completed';
  end if;

  update challenge_assignment
  set completed_at = null
  where id = p_assignment_id;

  delete from points_ledger
  where id = (
    select id from points_ledger
    where user_id = v_user_id and source = 'challenge_completion' and created_at = v_completed_at
    limit 1
  );
end;
$$;

revoke execute on function public.uncomplete_assignment(uuid) from public, anon;
grant execute on function public.uncomplete_assignment(uuid) to authenticated;
