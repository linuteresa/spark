-- Redesign for the real check-in flow (mood wheel -> energy level -> pillar
-- -> sub-stressor tag -> exactly one matched action), now that the actual
-- feeling-to-task mapping (EPIC 1) has been delivered as a 38 sub-stressor x
-- 3 energy-level matrix (114 actions) rather than the earlier focus-area /
-- challenge-catalog model. That older model (focus_areas, challenges,
-- rung-based ranking) is left in place but no longer used by the live flow
-- -- safer than dropping tables mid-build.
--
-- Emotion set also changes: the six characters in the actual design are
-- anxious, sad, foggy, restless, okay, happy -- replacing the placeholder
-- five (joyful, calm, anxious, sad, overwhelmed) used before designs existed.

alter table check_in drop constraint check_in_emotion_check;
alter table check_in add constraint check_in_emotion_check
  check (emotion in ('anxious', 'sad', 'foggy', 'restless', 'okay', 'happy'));

alter table check_in add column energy_level smallint check (energy_level between 1 and 3);
alter table check_in add column pillar text check (pillar in ('social', 'education', 'career', 'health_personal'));
alter table check_in add column substressor_code text;

create table sub_stressors (
  code text primary key,
  pillar text not null check (pillar in ('social', 'education', 'career', 'health_personal')),
  label text not null,
  sort_order smallint not null
);

alter table check_in add constraint check_in_substressor_fkey
  foreign key (substressor_code) references sub_stressors (code);

create table action_matrix (
  id uuid primary key default gen_random_uuid(),
  substressor_code text not null references sub_stressors (code),
  energy_level smallint not null check (energy_level between 1 and 3),
  action_text text not null,
  unique (substressor_code, energy_level)
);

alter table sub_stressors enable row level security;
alter table action_matrix enable row level security;

create policy sub_stressors_select_authenticated on sub_stressors
  for select to authenticated
  using (true);

create policy action_matrix_select_authenticated on action_matrix
  for select to authenticated
  using (true);

-- The new flow always resolves to exactly one action per day, looked up
-- directly rather than ranked/assigned by a nightly job, so challenge_id
-- (the old focus-area-driven catalog reference) is no longer always
-- available at insert time.
alter table challenge_assignment alter column challenge_id drop not null;
alter table challenge_assignment add column action_matrix_id uuid references action_matrix (id);
alter table challenge_assignment add constraint challenge_assignment_one_source_check
  check (challenge_id is not null or action_matrix_id is not null);
