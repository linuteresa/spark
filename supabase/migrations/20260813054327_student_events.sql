-- Student Events segment of Social Hub. Distinct from the pre-existing
-- read-only campus_event table (20260802120007), which is a service-role
-- populated official calendar with no created_by/kind/join support --
-- students both browse and create these, so a separate table with an
-- attendee join is needed.

create table student_event (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools (id),
  created_by uuid not null references profiles (id) on delete cascade,
  kind text not null check (kind in ('club', 'student')),
  title text not null,
  about text,
  notes text,
  event_date date not null,
  created_at timestamptz not null default now()
);

create index student_event_school_date_idx on student_event (school_id, event_date);

create table student_event_attendee (
  event_id uuid not null references student_event (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table student_event enable row level security;
alter table student_event_attendee enable row level security;

create policy student_event_select_same_school on student_event
  for select to authenticated
  using (school_id = current_school_id());

create policy student_event_owner_insert on student_event
  for insert to authenticated
  with check (created_by = auth.uid() and school_id = current_school_id());

create policy student_event_owner_delete on student_event
  for delete to authenticated
  using (created_by = auth.uid());

create policy student_event_attendee_select_same_school on student_event_attendee
  for select to authenticated
  using (
    exists (
      select 1 from student_event se
      where se.id = student_event_attendee.event_id
        and se.school_id = current_school_id()
    )
  );

create policy student_event_attendee_owner_insert on student_event_attendee
  for insert to authenticated
  with check (user_id = auth.uid());

create policy student_event_attendee_owner_delete on student_event_attendee
  for delete to authenticated
  using (user_id = auth.uid());
