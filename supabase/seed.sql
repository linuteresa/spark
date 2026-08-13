-- Sample data: one campus, the full focus-area taxonomy, forty challenges
-- across all three kinds, and five test accounts -- one of which (Amara) has
-- a completed check-in through reflection so the full loop is demoable
-- without any additional setup. Local/dev use only; never run against a
-- production project.

insert into schools (id, name, email_domain, timezone) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'State University (Demo)', 'demo.spark.edu', 'America/New_York');

-- Focus-area taxonomy
insert into focus_areas (id, parent_id, slug, label) values
  ('1a4b9f67-4e07-5cc3-a66a-7da48b6792bf', null, 'social-anxiety', 'Social anxiety'),
  ('2d0a4be5-a0fc-5bf7-82d0-6d6cce05f75c', '1a4b9f67-4e07-5cc3-a66a-7da48b6792bf', 'hyper-awareness', 'Hyper-awareness'),
  ('c9801204-d701-5927-89b2-9657f991a567', '1a4b9f67-4e07-5cc3-a66a-7da48b6792bf', 'avoidance-and-exhaustion', 'Avoidance and exhaustion'),
  ('105c8981-331b-5f7d-bb56-7f3a04b8ca3d', '1a4b9f67-4e07-5cc3-a66a-7da48b6792bf', 'public-speaking', 'Public speaking'),
  ('d7b2390a-cdc8-5695-82d1-39ce0ef7eb7b', '1a4b9f67-4e07-5cc3-a66a-7da48b6792bf', 'social-avoidance', 'Social avoidance'),
  ('721084c4-7806-5425-9ab7-9ea41ef38692', null, 'loneliness-and-isolation', 'Loneliness and isolation'),
  ('399e56a7-f08c-5119-8abc-3bb0f72fadf3', '721084c4-7806-5425-9ab7-9ea41ef38692', 'low-stakes-entry-point', 'Lack of a low-stakes entry point'),
  ('212e4a2c-5c94-548a-b27b-d7e172c332cc', '721084c4-7806-5425-9ab7-9ea41ef38692', 'conditional-belonging', 'Conditional sense of belonging'),
  ('c3e612a3-01d8-578e-9a22-ad5371a6570a', '721084c4-7806-5425-9ab7-9ea41ef38692', 'commuter-disconnection', 'Commuter disconnection'),
  ('177aa4b6-01a7-5c70-b3b3-3b018f3cfc41', null, 'emotional-dysregulation', 'Emotional dysregulation'),
  ('0a862f6f-e7da-5e6b-b83b-18c267245935', '177aa4b6-01a7-5c70-b3b3-3b018f3cfc41', 'decision-paralysis', 'Decision paralysis'),
  ('b4c6e8df-b82d-5a36-9d56-0d3cc113fe70', '177aa4b6-01a7-5c70-b3b3-3b018f3cfc41', 'emotional-numbness', 'Emotional numbness'),
  ('3d9018f4-0b78-56f0-9596-c62e91805c69', '177aa4b6-01a7-5c70-b3b3-3b018f3cfc41', 'low-self-efficacy', 'Low self-efficacy'),
  ('2b267cee-c5b3-505f-bd51-65fb555ba6ec', '177aa4b6-01a7-5c70-b3b3-3b018f3cfc41', 'passive-screen-dependency', 'Passive screen dependency')
on conflict (id) do nothing;

-- Challenge catalog
insert into challenges (focus_area_id, kind, rung, title, description, duration_minutes, needs_buddy, reviewed_by) values
  ('2d0a4be5-a0fc-5bf7-82d0-6d6cce05f75c', 'solo_reset', 1, 'Box breathing, four rounds', 'Inhale 4, hold 4, exhale 4, hold 4 -- four times, anywhere you''re sitting right now.', 3, false, 'counseling-review-pending'),
  ('2d0a4be5-a0fc-5bf7-82d0-6d6cce05f75c', 'solo_reset', 1, 'Name five things you can see', 'A quick grounding scan of the room to step out of your head and into the space around you.', 3, false, 'counseling-review-pending'),
  ('2d0a4be5-a0fc-5bf7-82d0-6d6cce05f75c', 'irl_challenge', 2, 'Sit in the front third of a lecture', 'Pick a seat closer than usual and stay for the full period.', 50, false, 'counseling-review-pending'),
  ('2d0a4be5-a0fc-5bf7-82d0-6d6cce05f75c', 'community_moment', 2, 'Say one unplanned thing in a group chat', 'Post a thought you''d normally sit on -- no need for a reply.', 5, false, 'counseling-review-pending'),
  ('c9801204-d701-5927-89b2-9657f991a567', 'solo_reset', 1, 'Two-minute stretch break', 'Stand up and stretch through the tension of avoiding something.', 2, false, 'counseling-review-pending'),
  ('c9801204-d701-5927-89b2-9657f991a567', 'irl_challenge', 2, 'Send the email you''ve been putting off', 'Draft and send one message you''ve been avoiding -- keep it short.', 10, false, 'counseling-review-pending'),
  ('c9801204-d701-5927-89b2-9657f991a567', 'irl_challenge', 3, 'Attend the event you almost skipped', 'Show up for at least fifteen minutes to something you were tempted to cancel on.', 15, false, 'counseling-review-pending'),
  ('c9801204-d701-5927-89b2-9657f991a567', 'community_moment', 1, 'Tell a friend what you''ve been avoiding', 'A short, honest check-in with someone you trust.', 5, true, 'counseling-review-pending'),
  ('105c8981-331b-5f7d-bb56-7f3a04b8ca3d', 'solo_reset', 1, 'Read your notes out loud, alone', 'Practice speaking your material in a low-stakes setting first.', 5, false, 'counseling-review-pending'),
  ('105c8981-331b-5f7d-bb56-7f3a04b8ca3d', 'irl_challenge', 2, 'Ask one question in class', 'Raise your hand and ask something -- any question counts.', 5, false, 'counseling-review-pending'),
  ('105c8981-331b-5f7d-bb56-7f3a04b8ca3d', 'irl_challenge', 3, 'Volunteer to present first', 'Take the first slot instead of waiting and dreading it.', 10, false, 'counseling-review-pending'),
  ('105c8981-331b-5f7d-bb56-7f3a04b8ca3d', 'community_moment', 2, 'Record a 30-second voice memo and share it', 'Practice speaking to be heard, not just to yourself.', 5, true, 'counseling-review-pending'),
  ('d7b2390a-cdc8-5695-82d1-39ce0ef7eb7b', 'solo_reset', 1, 'Write down one person you miss talking to', 'No need to reach out yet -- just notice who comes to mind.', 3, false, 'counseling-review-pending'),
  ('d7b2390a-cdc8-5695-82d1-39ce0ef7eb7b', 'irl_challenge', 1, 'Say hello to someone in your dorm or class', 'One greeting, no conversation required unless you want one.', 5, false, 'counseling-review-pending'),
  ('d7b2390a-cdc8-5695-82d1-39ce0ef7eb7b', 'irl_challenge', 2, 'Eat a meal somewhere other than alone in your room', 'Dining hall, lounge, anywhere with other people around.', 20, false, 'counseling-review-pending'),
  ('d7b2390a-cdc8-5695-82d1-39ce0ef7eb7b', 'community_moment', 2, 'Invite someone to a study session', 'A low-pressure, task-focused way to spend time with another person.', 10, true, 'counseling-review-pending'),
  ('399e56a7-f08c-5119-8abc-3bb0f72fadf3', 'solo_reset', 1, 'Browse the campus feed for two minutes', 'Just look -- no posting required.', 2, false, 'counseling-review-pending'),
  ('399e56a7-f08c-5119-8abc-3bb0f72fadf3', 'community_moment', 1, 'React to one post on the campus feed', 'A tap is enough -- it''s a real signal that you were there.', 1, false, 'counseling-review-pending'),
  ('399e56a7-f08c-5119-8abc-3bb0f72fadf3', 'community_moment', 2, 'Post one honest sentence to the feed', 'Say how today actually went, in your own words.', 3, false, 'counseling-review-pending'),
  ('399e56a7-f08c-5119-8abc-3bb0f72fadf3', 'irl_challenge', 2, 'Sit in a common space for ten minutes', 'No interaction required -- just be around people.', 10, false, 'counseling-review-pending'),
  ('212e4a2c-5c94-548a-b27b-d7e172c332cc', 'solo_reset', 1, 'List one thing you don''t have to perform to belong to', 'A short reflection on a space where you can just show up as you are.', 3, false, 'counseling-review-pending'),
  ('212e4a2c-5c94-548a-b27b-d7e172c332cc', 'community_moment', 2, 'Show up to a club or org meeting as-is', 'Skip the mental preparation -- just attend.', 30, false, 'counseling-review-pending'),
  ('212e4a2c-5c94-548a-b27b-d7e172c332cc', 'irl_challenge', 2, 'Join a group activity already in progress', 'Walk into something ongoing rather than waiting for an invite.', 15, false, 'counseling-review-pending'),
  ('c3e612a3-01d8-578e-9a22-ad5371a6570a', 'solo_reset', 1, 'Plan one thing to look forward to on campus', 'Something small that makes staying on campus a little longer worth it.', 3, false, 'counseling-review-pending'),
  ('c3e612a3-01d8-578e-9a22-ad5371a6570a', 'irl_challenge', 2, 'Stay on campus for one extra hour', 'Use the time for anything social or restorative, not just errands.', 60, false, 'counseling-review-pending'),
  ('c3e612a3-01d8-578e-9a22-ad5371a6570a', 'community_moment', 2, 'Message a classmate you only see on campus', 'Keep a campus-only connection going outside of class time.', 5, true, 'counseling-review-pending'),
  ('0a862f6f-e7da-5e6b-b83b-18c267245935', 'solo_reset', 1, 'Pick the first reasonable option', 'Practice deciding fast on something low-stakes: what to eat, wear, or watch.', 3, false, 'counseling-review-pending'),
  ('0a862f6f-e7da-5e6b-b83b-18c267245935', 'solo_reset', 2, 'Set a five-minute timer for one decision', 'Give yourself a hard stop so the decision has to happen.', 5, false, 'counseling-review-pending'),
  ('0a862f6f-e7da-5e6b-b83b-18c267245935', 'irl_challenge', 2, 'Make one plan without asking anyone else first', 'Choose and commit, then tell people after.', 10, false, 'counseling-review-pending'),
  ('b4c6e8df-b82d-5a36-9d56-0d3cc113fe70', 'solo_reset', 1, 'Name the emotion under the numbness', 'A quiet minute to notice what might be underneath feeling flat.', 3, false, 'counseling-review-pending'),
  ('b4c6e8df-b82d-5a36-9d56-0d3cc113fe70', 'solo_reset', 2, 'Put on one song that used to move you', 'Let yourself actually listen, not just have it playing.', 4, false, 'counseling-review-pending'),
  ('b4c6e8df-b82d-5a36-9d56-0d3cc113fe70', 'irl_challenge', 2, 'Do one physical thing outdoors', 'A short walk, stretch, or errand outside -- movement and air.', 15, false, 'counseling-review-pending'),
  ('b4c6e8df-b82d-5a36-9d56-0d3cc113fe70', 'community_moment', 2, 'Tell someone honestly that you''re feeling flat', 'Naming it out loud to another person, no performance required.', 5, true, 'counseling-review-pending'),
  ('3d9018f4-0b78-56f0-9596-c62e91805c69', 'solo_reset', 1, 'Write down one thing you finished this week', 'Evidence against the story that nothing gets done.', 3, false, 'counseling-review-pending'),
  ('3d9018f4-0b78-56f0-9596-c62e91805c69', 'irl_challenge', 1, 'Complete one small, fully-finishable task', 'Something you can start and finish in one sitting.', 10, false, 'counseling-review-pending'),
  ('3d9018f4-0b78-56f0-9596-c62e91805c69', 'irl_challenge', 2, 'Start the task you''ve been circling', 'Just the first five minutes -- momentum over completion.', 5, false, 'counseling-review-pending'),
  ('2b267cee-c5b3-505f-bd51-65fb555ba6ec', 'solo_reset', 1, 'Put your phone in another room for ten minutes', 'A short, deliberate break from passive scrolling.', 10, false, 'counseling-review-pending'),
  ('2b267cee-c5b3-505f-bd51-65fb555ba6ec', 'solo_reset', 2, 'Go for a walk with your phone in your pocket', 'Movement without the screen as a companion.', 15, false, 'counseling-review-pending'),
  ('2b267cee-c5b3-505f-bd51-65fb555ba6ec', 'irl_challenge', 2, 'Do one offline hobby for fifteen minutes', 'Draw, read on paper, cook -- anything without a screen.', 15, false, 'counseling-review-pending'),
  ('2b267cee-c5b3-505f-bd51-65fb555ba6ec', 'community_moment', 2, 'Call instead of texting someone today', 'Trade a passive channel for a synchronous one, just once.', 10, true, 'counseling-review-pending');

-- Test accounts. Password for all five is 'sparkdemo123' (local/dev only).
-- confirmation_token / recovery_token / email_change* are set to '' rather
-- than left null: GoTrue (Supabase Auth) expects non-null strings there,
-- a known gotcha when seeding auth.users directly.
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
select
  u.id::uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', u.email,
  crypt('sparkdemo123', gen_salt('bf')), now(), now(), now(),
  '{"provider":"email","providers":["email"]}', '{}',
  '', '', '', ''
from (values
  ('11111111-1111-1111-1111-111111111111', 'amara@demo.spark.edu'),
  ('22222222-2222-2222-2222-222222222222', 'devon@demo.spark.edu'),
  ('33333333-3333-3333-3333-333333333333', 'priya@demo.spark.edu'),
  ('44444444-4444-4444-4444-444444444444', 'malik@demo.spark.edu'),
  ('55555555-5555-5555-5555-555555555555', 'yuki@demo.spark.edu')
) as u(id, email);

insert into profiles (id, school_id, email, display_name, social_energy, feed_opt_out, buddy_opt_in) values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'amara@demo.spark.edu', 'Amara', 4, false, true),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'devon@demo.spark.edu', 'Devon', 2, false, true),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'priya@demo.spark.edu', 'Priya', 3, false, true),
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'malik@demo.spark.edu', 'Malik', 5, false, true),
  ('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'yuki@demo.spark.edu', 'Yuki', 1, false, true);

-- Onboarding-weighted focus areas (one representative pair per test account)
insert into user_focus (user_id, focus_area_id, weight, source) values
  ('11111111-1111-1111-1111-111111111111', '2d0a4be5-a0fc-5bf7-82d0-6d6cce05f75c', 2.0, 'onboarding'),
  ('11111111-1111-1111-1111-111111111111', '399e56a7-f08c-5119-8abc-3bb0f72fadf3', 1.0, 'onboarding'),
  ('22222222-2222-2222-2222-222222222222', 'c3e612a3-01d8-578e-9a22-ad5371a6570a', 2.0, 'onboarding'),
  ('22222222-2222-2222-2222-222222222222', '2b267cee-c5b3-505f-bd51-65fb555ba6ec', 1.0, 'onboarding'),
  ('33333333-3333-3333-3333-333333333333', '0a862f6f-e7da-5e6b-b83b-18c267245935', 2.0, 'onboarding'),
  ('33333333-3333-3333-3333-333333333333', '3d9018f4-0b78-56f0-9596-c62e91805c69', 1.0, 'onboarding'),
  ('44444444-4444-4444-4444-444444444444', '105c8981-331b-5f7d-bb56-7f3a04b8ca3d', 2.0, 'onboarding'),
  ('44444444-4444-4444-4444-444444444444', '212e4a2c-5c94-548a-b27b-d7e172c332cc', 1.0, 'onboarding'),
  ('55555555-5555-5555-5555-555555555555', 'b4c6e8df-b82d-5a36-9d56-0d3cc113fe70', 2.0, 'onboarding'),
  ('55555555-5555-5555-5555-555555555555', 'd7b2390a-cdc8-5695-82d1-39ce0ef7eb7b', 1.0, 'onboarding');

-- Full-loop demo data for Amara: a check-in routed to an assignment she
-- has already completed and reflected on, so Points & Streak has data to show.
insert into check_in (user_id, emotion, intensity, context) values
  ('11111111-1111-1111-1111-111111111111', 'anxious', 3, 'class');

select set_config('request.jwt.claims', '{"role":"service_role"}', true);

with demo_challenge as (
  select id from challenges where title = 'Name five things you can see' limit 1
), demo_assignment as (
  insert into challenge_assignment (user_id, challenge_id, for_date, rank, reason)
  select '11111111-1111-1111-1111-111111111111', id, current_date, 1, 'Matches your check-in and your focus areas.' from demo_challenge
  returning id
)
select complete_assignment(id) from demo_assignment;
-- Seed scripts don't run through PostgREST, so request.jwt.claims is set
-- explicitly above to match a service-role call for this RPC.

-- Sample feed post + reaction (Amara posts, Devon reacts)
with demo_post as (
  insert into feed_post (user_id, school_id, body)
  values ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Did the five-things grounding exercise between classes today. Small win.')
  returning id
)
insert into feed_reaction (post_id, user_id, reaction_type)
select id, '22222222-2222-2222-2222-222222222222', 'support' from demo_post;
