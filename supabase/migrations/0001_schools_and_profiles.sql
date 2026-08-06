-- Schools and student profiles.
-- profiles.id mirrors auth.users.id 1:1 (Supabase Auth owns identity; this table owns product data).
-- "user" is reserved in SQL, so the doc's `user` entity is modeled here as `profiles`.

create extension if not exists pgcrypto;

create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email_domain text not null unique,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  school_id uuid not null references schools (id),
  email text not null unique,
  display_name text,
  social_energy smallint check (social_energy between 1 and 5),
  feed_opt_out boolean not null default false,
  buddy_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

create index profiles_school_id_idx on profiles (school_id);

-- SECURITY DEFINER so this bypasses profiles' own RLS. Any policy on
-- profiles that looks up the caller's school_id by querying profiles
-- itself -- including the one directly below -- would otherwise recurse
-- infinitely; Postgres does not short-circuit on the id = auth.uid() row
-- being trivially visible. Every other table's "same school" policies use
-- this too (see 0006, 0007) rather than repeating the inline subquery.
create function current_school_id() returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id from profiles where id = auth.uid()
$$;

alter table schools enable row level security;
alter table profiles enable row level security;

-- Schools: readable by any authenticated user (needed at signup to resolve email_domain -> school).
create policy schools_select_authenticated on schools
  for select to authenticated
  using (true);

-- Profiles: a student manages their own row. Same-school peers may look up
-- id/display_name (needed for feed authorship and future buddy display) via
-- this same policy, since RLS filters rows, not columns -- if column-level
-- privacy on profiles becomes necessary, expose a restricted view instead of
-- widening this policy.
create policy profiles_select_own_or_same_school on profiles
  for select to authenticated
  using (
    id = auth.uid()
    or school_id = current_school_id()
  );

create policy profiles_insert_own on profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy profiles_update_own on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
