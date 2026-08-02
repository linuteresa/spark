-- Check-ins: the start of every session. Strictly private -- no other
-- student, including a buddy, may ever read another student's check-in
-- (see Security and Compliance -> Check-in privacy in the architecture doc).

create table check_in (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  emotion text not null check (emotion in ('joyful', 'calm', 'anxious', 'sad', 'overwhelmed')),
  intensity smallint not null check (intensity between 1 and 5),
  context text,
  created_at timestamptz not null default now()
);

create index check_in_user_recency_idx on check_in (user_id, created_at desc);

alter table check_in enable row level security;

-- Check-ins are immutable: insert and select only, no update/delete policy.
create policy check_in_owner_select on check_in
  for select to authenticated
  using (user_id = auth.uid());

create policy check_in_owner_insert on check_in
  for insert to authenticated
  with check (user_id = auth.uid());
