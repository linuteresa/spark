-- Reverses the "reactions only, no comments" decision from
-- 20260802120006_feed_and_reactions.sql -- team now wants students able to
-- comment on each other's posts. Visibility and write rules mirror
-- feed_reaction exactly: visible/insertable to any same-school student
-- whose target post they can see, deletable only by the comment's own
-- author (not the post owner, matching feed_reaction's precedent).

create table feed_comment (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references feed_post (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create index feed_comment_post_id_idx on feed_comment (post_id, created_at);

alter table feed_comment enable row level security;

create policy feed_comment_select_with_post on feed_comment
  for select to authenticated
  using (
    exists (
      select 1 from feed_post fp
      where fp.id = feed_comment.post_id
        and fp.school_id = current_school_id()
    )
  );

create policy feed_comment_owner_insert on feed_comment
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from feed_post fp
      where fp.id = feed_comment.post_id
        and fp.school_id = current_school_id()
    )
  );

create policy feed_comment_owner_delete on feed_comment
  for delete to authenticated
  using (user_id = auth.uid());
