-- Product decision: Campus Feed is one shared feed across the whole app,
-- not scoped per school. Drops the school_id = current_school_id() gate
-- from feed_post/feed_reaction/feed_comment select (and feed_comment
-- insert), keeping only the feed_opt_out check. schools/school_id stay in
-- the schema for other features (check-in, RLS elsewhere) -- only the
-- feed's own visibility predicate changes.

drop policy feed_post_select_same_school_opted_in on feed_post;
create policy feed_post_select_opted_in on feed_post
  for select to authenticated
  using (
    not exists (
      select 1 from profiles p
      where p.id = feed_post.user_id and p.feed_opt_out = true
    )
  );

drop policy feed_reaction_select_with_post on feed_reaction;
create policy feed_reaction_select_with_post on feed_reaction
  for select to authenticated
  using (
    exists (select 1 from feed_post fp where fp.id = feed_reaction.post_id)
  );

drop policy feed_comment_select_with_post on feed_comment;
create policy feed_comment_select_with_post on feed_comment
  for select to authenticated
  using (
    exists (select 1 from feed_post fp where fp.id = feed_comment.post_id)
  );

drop policy feed_comment_owner_insert on feed_comment;
create policy feed_comment_owner_insert on feed_comment
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from feed_post fp where fp.id = feed_comment.post_id)
  );
