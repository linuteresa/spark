-- Challenge catalog (human-authored, reviewed) plus the per-student daily
-- assignment and reflection. `kind` covers all three post-check-in options
-- (Solo Reset, IRL Challenge, Community Moment) so a single ranked table
-- can produce "all three, always" -- see docs/screen-data-contract.md.

create table challenges (
  id uuid primary key default gen_random_uuid(),
  focus_area_id uuid not null references focus_areas (id),
  kind text not null check (kind in ('solo_reset', 'irl_challenge', 'community_moment')),
  rung smallint not null check (rung >= 1),
  title text not null,
  description text not null,
  duration_minutes smallint not null check (duration_minutes > 0),
  needs_buddy boolean not null default false,
  reviewed_by text not null,
  created_at timestamptz not null default now()
);

create index challenges_focus_area_idx on challenges (focus_area_id);

create table challenge_assignment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  challenge_id uuid not null references challenges (id),
  for_date date not null,
  rank smallint not null,
  reason text,
  completed_at timestamptz,
  skipped_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, challenge_id, for_date)
);

create index challenge_assignment_user_date_idx on challenge_assignment (user_id, for_date);

create table reflection (
  assignment_id uuid primary key references challenge_assignment (id) on delete cascade,
  mood_before smallint not null check (mood_before between 1 and 5),
  mood_after smallint not null check (mood_after between 1 and 5),
  note text,
  prompt_used text,
  created_at timestamptz not null default now()
);

alter table challenges enable row level security;
alter table challenge_assignment enable row level security;
alter table reflection enable row level security;

-- Catalog is read-only for students; only the service role (nightly job,
-- admin tooling) writes to it.
create policy challenges_select_authenticated on challenges
  for select to authenticated
  using (true);

create policy challenge_assignment_owner_select on challenge_assignment
  for select to authenticated
  using (user_id = auth.uid());

-- Assignments are normally written by the nightly recommendation job
-- (service role). Completion/skip go through complete_assignment() /
-- skip_assignment() in 0009_functions.sql rather than a direct update, so
-- no update policy is granted to students here.

create policy reflection_owner_select on reflection
  for select to authenticated
  using (
    exists (
      select 1 from challenge_assignment a
      where a.id = reflection.assignment_id and a.user_id = auth.uid()
    )
  );

-- Reflections are written by complete_assignment() (SECURITY DEFINER), not
-- inserted directly by students, so no insert policy is granted here either.
