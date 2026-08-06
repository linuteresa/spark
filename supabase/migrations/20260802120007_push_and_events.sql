-- Push tokens and campus events (event-based challenges).

create table push_token (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  token text not null,
  platform text not null check (platform in ('ios', 'android')),
  created_at timestamptz not null default now(),
  unique (user_id, token)
);

create table campus_event (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools (id),
  title text not null,
  starts_at timestamptz not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index campus_event_school_starts_idx on campus_event (school_id, starts_at);

alter table push_token enable row level security;
alter table campus_event enable row level security;

create policy push_token_owner_select on push_token
  for select to authenticated
  using (user_id = auth.uid());

create policy push_token_owner_insert on push_token
  for insert to authenticated
  with check (user_id = auth.uid());

create policy push_token_owner_delete on push_token
  for delete to authenticated
  using (user_id = auth.uid());

-- Populated per-campus by a manual import or calendar-feed adapter (service
-- role); students only ever read.
create policy campus_event_select_same_school on campus_event
  for select to authenticated
  using (school_id = current_school_id());
