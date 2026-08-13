-- Standalone journaling (Recharge > Journal tab): free-form entries a
-- student adds any time, decoupled from challenge_assignment completion --
-- distinct from the existing reflection table, which is strictly tied to a
-- completed assignment via reflect_assignment().

create table journal_entry (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  prompt_used text,
  body text not null,
  created_at timestamptz not null default now()
);

create index journal_entry_user_recency_idx on journal_entry (user_id, created_at desc);

alter table journal_entry enable row level security;

create policy journal_entry_owner_select on journal_entry
  for select to authenticated
  using (user_id = auth.uid());

create policy journal_entry_owner_insert on journal_entry
  for insert to authenticated
  with check (user_id = auth.uid());

create policy journal_entry_owner_delete on journal_entry
  for delete to authenticated
  using (user_id = auth.uid());
