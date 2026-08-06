-- Focus-area taxonomy: parent issues (social anxiety, loneliness and
-- isolation, emotional dysregulation) and their sub-issues. Feeds the
-- challenge ladder, onboarding weighting, and buddy matching (buddy_pairing
-- is created later, in 0006, but references this table).

create table focus_areas (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references focus_areas (id),
  slug text not null unique,
  label text not null
);

-- Team-authored content; students never write to this table.
create table user_focus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  focus_area_id uuid not null references focus_areas (id),
  weight numeric not null default 1,
  source text not null check (source in ('onboarding', 'goal', 'manual')),
  created_at timestamptz not null default now(),
  unique (user_id, focus_area_id, source)
);

create index user_focus_user_id_idx on user_focus (user_id);

alter table focus_areas enable row level security;
alter table user_focus enable row level security;

create policy focus_areas_select_authenticated on focus_areas
  for select to authenticated
  using (true);

create policy user_focus_owner_select on user_focus
  for select to authenticated
  using (user_id = auth.uid());

create policy user_focus_owner_insert on user_focus
  for insert to authenticated
  with check (user_id = auth.uid());

create policy user_focus_owner_update on user_focus
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
