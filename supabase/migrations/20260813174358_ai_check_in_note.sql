-- Storage for the AI-personalized encouragement generated alongside a
-- check-in (see supabase/functions/checkin-ai-note). Written by the edge
-- function's service-role client, never by students directly, so no new
-- RLS write policy is needed -- the existing challenge_assignment_owner_select
-- policy already covers reading this column since RLS is row-scoped, not
-- column-scoped.

alter table challenge_assignment add column ai_note text;
