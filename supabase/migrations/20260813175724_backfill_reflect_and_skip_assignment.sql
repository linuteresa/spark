-- reflect_assignment and skip_assignment were created directly against the
-- hosted project (execute_sql) and never captured in a migration -- true
-- schema drift, not just a missing local file: supabase_migrations
-- .schema_migrations had no record of creating them either. Backfilling
-- from the live definitions so a fresh clone/CI run reconstructs them.

create or replace function public.reflect_assignment(
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

create or replace function public.skip_assignment(p_assignment_id uuid)
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

revoke execute on function public.reflect_assignment(uuid, smallint, smallint, text, text) from public, anon;
revoke execute on function public.skip_assignment(uuid) from public, anon;
grant execute on function public.reflect_assignment(uuid, smallint, smallint, text, text) to authenticated;
grant execute on function public.skip_assignment(uuid) to authenticated;
