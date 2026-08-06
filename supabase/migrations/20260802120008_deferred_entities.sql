-- Schema-ready, UI-paused entities. Both are represented now so activating
-- either later needs no migration -- not because either ships in this MVP.
--
-- companion_state: Living Companion is confirmed DEFERRED to a fast-follow.
-- No screen, endpoint, or acceptance criterion in this MVP depends on it.
--
-- buddy_pairing: Accountability Buddy System status is still open (pending
-- a team decision on Should-Have vs Must-Have). Table exists so that
-- decision doesn't block on a schema change.

create table buddy_pairing (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references profiles (id) on delete cascade,
  user_b uuid not null references profiles (id) on delete cascade,
  focus_area_id uuid references focus_areas (id),
  status text not null default 'pending' check (status in ('pending', 'active', 'ended')),
  matched_at timestamptz,
  check (user_a <> user_b)
);

create table companion_state (
  user_id uuid primary key references profiles (id) on delete cascade,
  stage text,
  mood text,
  updated_at timestamptz not null default now()
);

alter table buddy_pairing enable row level security;
alter table companion_state enable row level security;

create policy buddy_pairing_participant_select on buddy_pairing
  for select to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());

create policy companion_state_owner_select on companion_state
  for select to authenticated
  using (user_id = auth.uid());

-- No insert/update policies for students on either table: both are
-- populated by backend processes (matching job / companion service) that
-- do not exist yet in this MVP.
