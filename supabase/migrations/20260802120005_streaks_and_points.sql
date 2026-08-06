-- Streak (one row per student) and an append-only points ledger. The ledger
-- is authoritative -- the displayed balance is sum(amount), never a mutable
-- counter, so concurrent completions can't lose an update (see architecture
-- doc, Data Model -> "Two modeling decisions").

create table streak (
  user_id uuid primary key references profiles (id) on delete cascade,
  current_count smallint not null default 0,
  longest smallint not null default 0,
  last_date date
);

create table points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  source text not null,
  amount integer not null,
  created_at timestamptz not null default now()
);

create index points_ledger_user_id_idx on points_ledger (user_id);

alter table streak enable row level security;
alter table points_ledger enable row level security;

create policy streak_owner_select on streak
  for select to authenticated
  using (user_id = auth.uid());

create policy points_ledger_owner_select on points_ledger
  for select to authenticated
  using (user_id = auth.uid());

-- Both tables are written only by complete_assignment() (SECURITY DEFINER,
-- see 0009_functions.sql), so neither has an insert/update policy for
-- students -- this is what keeps "balance = sum(ledger)" true under
-- concurrent writes.
