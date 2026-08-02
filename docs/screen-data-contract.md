# Screen data contract

What each MVP screen reads from and writes to the database. Source of truth
for the schema is `supabase/migrations/`; source of truth for the screen
sequence is the Sprint 5 Technical Architecture doc, Section "MVP screen
sequence." This document exists so frontend work can proceed against a
fixed contract without re-deriving it from the migrations each time.

## Resolved (do not reopen without a team decision)

**Post-check-in routing always shows all three options.** Solo Reset, IRL
Challenge, and Community Moment are ranked and the top-ranked one is
highlighted, but no option is ever hidden or gated behind another. This is
confirmed team direction, not an open design question — implemented in
`YourOptionsScreen` (`app/screens/YourOptionsScreen.tsx`), which renders
every row `challenge_assignment` returns for the day rather than filtering
to a single recommendation.

**The Living Companion is deferred.** It is not part of this release. It is
represented in the schema (`companion_state`, migration
`0008_deferred_entities.sql`) as a forward-compatible entity so activating
it later needs no migration, but no screen, endpoint, or acceptance
criterion in the current scope depends on it. Do not build a Companion
screen against Wave 1/2 work without an explicit scope change.

**Reactions only — no threaded replies.** `feed_reaction` is one row per
`(post, student)`, `reaction_type` from a fixed set, no comment text. A
reply/comment entity is intentionally not modeled (migration
`0006_feed_and_reactions.sql`).

## Wave 1 — core loop (scaffolded in `app/screens/`)

| Screen | Reads | Writes |
|---|---|---|
| Home / Emotion Check-In Wheel (`CheckInWheelScreen`) | — | `check_in` (insert: `user_id`, `emotion`, `intensity`) |
| Your Options (`YourOptionsScreen`) | `challenge_assignment` joined to `challenges`, filtered to `user_id` + today, ordered by `rank` — always renders all rows returned, never just the top one | — |
| Daily IRL Challenge (`DailyChallengeScreen`) | `challenge_assignment` joined to `challenges`, by `assignment_id` | — |
| Complete & Reflect (`CompleteReflectScreen`) | — | RPC `complete_assignment(assignment_id)` (sets `challenge_assignment.completed_at`, inserts `points_ledger` row, upserts `streak`, one transaction); RPC `reflect_assignment(assignment_id, mood_before, mood_after, note, prompt_used)` (inserts `reflection`) |
| Points & Streak view (`StreakScreen`) | `streak` (`current_count`, `longest`) by `user_id`; `points_ledger` summed by `user_id` | — |

## Wave 2 — full MVP (schema ready; screens not yet built)

| Screen | Reads | Writes |
|---|---|---|
| Solo Reset (breathe / journal / move / walk) | `challenge_assignment` joined to `challenges` where `kind = 'solo_reset'` | Same completion path as Daily IRL Challenge: RPC `complete_assignment` / `reflect_assignment` |
| Community Feed | `feed_post` scoped to `school_id`, excluding authors with `feed_opt_out = true` (enforced in the `feed_post` RLS policy, not client-side); `feed_reaction` per post | `feed_post` (insert); `feed_reaction` (insert/delete, one per `(post, user)`); `moderation_flag` (insert, on report) |
| Onboarding (tap-only, six screens, no free text) | `focus_areas` (for the icon grid / goal selection options) | `user_focus` (weighted rows, `source in ('onboarding','goal')`); `profiles.social_energy`; `profiles.buddy_opt_in` — see the six-screen breakdown below |
| Login (school email) | `schools` (resolve `email_domain` to `school_id`) | `auth.users` (Supabase Auth, school-email verification); `profiles` (insert on first login) |
| Settings / Profile | `profiles` | `profiles.feed_opt_out`, `profiles.buddy_opt_in`; `push_token` (insert/delete) |

### Onboarding screen-by-screen (six screens, no free text, every screen skippable)

| # | Question | Writes to |
|---|---|---|
| 1 | What has been hardest lately? (multi-select icon grid) | `user_focus` (weighted) |
| 2 | Where does this tend to show up? (class, dining, gym, events, dorm) | `check_in.context` default |
| 3 | What would feel like a win? (goal selection) | `user_focus` (goal weighting) |
| 4 | Current social energy level (five-point scale) | `profiles.social_energy` |
| 5 | Preferred reset style (walk, music, breathing, journaling) | Solo Reset ordering (client-side sort hint, not a stored preference table) |
| 6 | Preference for solo or shared activities | `profiles.buddy_opt_in` |

## Deferred — schema ready, no screen (out of scope for this pass)

| Entity | Status | Notes |
|---|---|---|
| `companion_state` | Deferred | Living Companion — see "Resolved" above |
| `buddy_pairing` | Pending | Accountability Buddy System Should-Have vs Must-Have decision is open; table exists so the decision doesn't block on a schema change |

## Conventions

- Every write to `check_in`, `challenge_assignment` (completion), `streak`,
  and `points_ledger` goes through row-level security scoped to
  `auth.uid()`, or through the `complete_assignment` / `reflect_assignment`
  SECURITY DEFINER functions — never a raw client-side `update` on
  `challenge_assignment`, `streak`, or `points_ledger` (see
  `supabase/migrations/0009_functions.sql`).
- `GET /today`-equivalent reads (Your Options, Points & Streak) are single
  round trips by design — the three-minute session budget means the opening
  screen can't depend on sequential requests.
