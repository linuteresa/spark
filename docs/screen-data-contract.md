# Screen data contract

What each MVP screen reads from and writes to the database. Source of truth
for the schema is `supabase/migrations/`. This repo is backend-only — the
frontend (Expo/React Native) lives in a separate repo, built by a different
developer; this document is the fixed contract they build against, so
frontend work doesn't need to re-derive it from the migrations.

**Nav is 4 tabs: Check-in, Recharge, Points, Settings**, plus a one-time
Login/Onboarding flow. This supersedes an earlier 3-tab/"always show three
options" design — see `## Superseded` below for what changed and why.

## Login

| Reads | Writes |
|---|---|
| `schools` (resolve `email_domain` → `school_id`) | `auth.users` (Supabase Auth; domain restricted server-side by the `restrict_signup_to_umd_domain` hook, `0011`); `profiles` (insert, first login only) |

## Check-in

| Reads | Writes |
|---|---|
| — | `check_in` (insert: `user_id`, `emotion`, `intensity`, `context`) |

One-time onboarding survey is folded into this tab for new profiles:

| Reads | Writes |
|---|---|
| `focus_areas` (icon grid options) | `user_focus` (weighted rows, `source in ('onboarding','goal')`); `profiles.social_energy`; `profiles.buddy_opt_in` |

## Recharge

| Reads | Writes |
|---|---|
| `challenge_assignment` joined to `challenges`, filtered to `user_id` + today — **2 rows** (not 3; see Superseded) | — |
| — | RPC `complete_assignment(assignment_id)` (sets `completed_at`, inserts `points_ledger` row, upserts `streak` — one transaction) |
| — | RPC `reflect_assignment(assignment_id, mood_before, mood_after, note, prompt_used)` (inserts `reflection`; optional) |
| — | RPC `skip_assignment(assignment_id)` |
| `reflection` joined to `challenge_assignment`/`challenges`, filtered to `kind = 'journal'`, ordered by `created_at desc` (previous journals) | — |

## Points

| Reads | Writes |
|---|---|
| `streak` (`current_count`, `longest`) by `user_id`; `points_ledger` summed by `user_id` | — |

## Settings

| Reads | Writes |
|---|---|
| `profiles` | `profiles.feed_opt_out`; `profiles.notifications_enabled` |

## Superseded (kept for context — do not build against this)

The original design showed **all three** post-check-in options (Solo
Reset / IRL Challenge / Community Moment) every time, with a full Community
Feed screen and a six-screen onboarding flow. The current MVP instead:

- Recommends **2** tasks per day, drawn from `breathe` / `walk` / `journal`
  (a retag of `challenges.kind`, not yet applied — see `docs/api-contract.md`
  "Open items")
- Drops Community Feed from primary navigation entirely — `feed_post` /
  `feed_reaction` / `moderation_flag` still exist in the schema and are
  still RLS-correct, but nothing in this MVP's nav reads or writes them;
  `feed_opt_out` in Settings is the only surface of this feature now
  - `feed_reaction` is one row per `(post, student)`, fixed `reaction_type`
    set, no free-text — no reply/comment entity exists, don't add one
    without a team decision reversing this
- Folds onboarding into the Check-in tab instead of a separate six-screen
  flow

## Deferred — schema ready, no screen

| Entity | Status | Notes |
|---|---|---|
| `companion_state` | Deferred | Living Companion. No screen or acceptance criterion in this MVP depends on it (`0008_deferred_entities.sql`). |
| `buddy_pairing` | Pending | Accountability Buddy System Should-Have vs Must-Have is still an open team decision; table exists so that decision doesn't block on a schema change. |
| `push_token` / `campus_event` | Schema ready | Token storage and event calendar exist; no dispatch function sends a push yet. |

## Conventions

- Every write to `check_in`, `challenge_assignment` completion, `streak`,
  and `points_ledger` goes through row-level security scoped to
  `auth.uid()`, or through the `complete_assignment` / `reflect_assignment`
  / `skip_assignment` SECURITY DEFINER functions — never a raw client-side
  `update` on `challenge_assignment`, `streak`, or `points_ledger` (see
  `supabase/migrations/0009_functions.sql`).
- Reads that back a tab's opening screen (Recharge, Points) are single
  round trips by design.
