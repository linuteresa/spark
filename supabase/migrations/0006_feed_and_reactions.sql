-- Campus feed, reactions, and moderation.
--
-- Immediate schema fix (per team direction): reactions only, one row per
-- (post, student), reaction_type drawn from a fixed set -- no free text, no
-- threaded replies or comments. A reply/comment entity is deliberately not
-- modeled; do not add one without a team decision reversing this.

create table feed_post (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  school_id uuid not null references schools (id),
  assignment_id uuid references challenge_assignment (id),
  body text,
  media_url text,
  created_at timestamptz not null default now()
);

create index feed_post_school_recency_idx on feed_post (school_id, created_at desc);

create table feed_reaction (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references feed_post (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  reaction_type text not null check (reaction_type in ('support', 'relate', 'proud', 'sending_love')),
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index feed_reaction_post_id_idx on feed_reaction (post_id);

create table moderation_flag (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references feed_post (id) on delete cascade,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'actioned')),
  reviewed_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

alter table feed_post enable row level security;
alter table feed_reaction enable row level security;
alter table moderation_flag enable row level security;

-- Visible to same-school students whose author has not opted out, enforced
-- server-side in the query itself (never relied on the client) -- this is
-- the feed_opt_out guarantee from the Security and Compliance section.
create policy feed_post_select_same_school_opted_in on feed_post
  for select to authenticated
  using (
    school_id = current_school_id()
    and not exists (
      select 1 from profiles p
      where p.id = feed_post.user_id and p.feed_opt_out = true
    )
  );

create policy feed_post_owner_insert on feed_post
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and school_id = current_school_id()
  );

create policy feed_post_owner_delete on feed_post
  for delete to authenticated
  using (user_id = auth.uid());

create policy feed_reaction_select_with_post on feed_reaction
  for select to authenticated
  using (
    exists (
      select 1 from feed_post fp
      where fp.id = feed_reaction.post_id
        and fp.school_id = current_school_id()
    )
  );

create policy feed_reaction_owner_insert on feed_reaction
  for insert to authenticated
  with check (user_id = auth.uid());

create policy feed_reaction_owner_delete on feed_reaction
  for delete to authenticated
  using (user_id = auth.uid());

-- Any authenticated student may report a post; only moderators (service
-- role / admin tooling) read the queue, so no select policy is granted here.
create policy moderation_flag_insert_authenticated on moderation_flag
  for insert to authenticated
  with check (true);
