-- Atomic operations for the core loop. Modeled as SECURITY DEFINER
-- functions rather than direct table writes, per the architecture doc's API
-- section: "logic that must be atomic ... is implemented as PostgreSQL
-- functions ... rather than in the application code." This is also why
-- challenge_assignment, streak, and points_ledger have no student-facing
-- insert/update RLS policies -- these functions are the only write path.

-- POST /assignments/{id}/complete
-- Marks an assignment complete, credits points, and updates the streak in
-- a single transaction (function bodies are atomic in Postgres).
create or replace function complete_assignment(p_assignment_id uuid)
returns table (current_streak smallint, longest_streak smallint, total_points bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_today date := current_date;
begin
  select user_id into v_user_id
  from challenge_assignment
  where id = p_assignment_id
  for update;

  if v_user_id is null then
    raise exception 'assignment not found';
  end if;

  -- Under the authenticated role auth.uid() is always the caller's id;
  -- under service_role (RLS is bypassed entirely, e.g. seed scripts and the
  -- nightly job) it is null, and the call is trusted like any other
  -- service-role write.
  if auth.uid() is not null and v_user_id <> auth.uid() then
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

grant execute on function complete_assignment(uuid) to authenticated;

-- POST /assignments/{id}/reflect
-- Requires the assignment to already be completed by the caller.
create or replace function reflect_assignment(
  p_assignment_id uuid,
  p_mood_before smallint,
  p_mood_after smallint,
  p_note text default null,
  p_prompt_used text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from challenge_assignment
    where id = p_assignment_id and user_id = auth.uid() and completed_at is not null
  ) then
    raise exception 'assignment not found, not yours, or not yet completed';
  end if;

  insert into reflection (assignment_id, mood_before, mood_after, note, prompt_used)
  values (p_assignment_id, p_mood_before, p_mood_after, p_note, p_prompt_used);
end;
$$;

grant execute on function reflect_assignment(uuid, smallint, smallint, text, text) to authenticated;

-- Lets a student decline today's top option without breaking their streak
-- state or blocking the completion path.
create or replace function skip_assignment(p_assignment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update challenge_assignment
  set skipped_at = now()
  where id = p_assignment_id and user_id = auth.uid() and completed_at is null;

  if not found then
    raise exception 'assignment not found, not yours, or already completed';
  end if;
end;
$$;

grant execute on function skip_assignment(uuid) to authenticated;
