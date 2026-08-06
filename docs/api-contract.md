# API / integration contract

There is no custom backend server. Every screen calls Supabase directly
(`.from()` / `.rpc()`), and row-level security — not application code —
enforces that a student only ever sees their own data. Source of truth for
the schema is `supabase/migrations/`; this document maps each screen in the
4-tab MVP (Check-in, Recharge, Points, Settings) to the calls it makes.

## Login

| Call | Notes |
|---|---|
| `supabase.auth.signInWithOAuth({ provider: 'google', options: { queryParams: { hd: 'umd.edu' } } })` | UMD uses Google Workspace, not email/password. The `hd` param is a UX hint only — a student can strip it client-side. |
| `supabase.from('schools').select('id').eq('email_domain', domain)` | Resolves the signed-in email's domain to a `school_id`, needed for the `profiles` insert below. |
| `supabase.from('profiles').insert({ id, school_id, email })` | Runs once, on first login only. |

**Server-side enforcement:** the `restrict_signup_to_umd_domain()` Auth Hook
(`0011_auth_hook_domain_restriction.sql`) rejects any signup whose email
isn't `@umd.edu`, before the `auth.users` row is even created. This is the
actual enforcement point — the `hd` param above is not. Registered for
local dev in `supabase/config.toml`; must also be enabled from the hosted
project's Dashboard → Authentication → Hooks.

## Check-in

| Call | Notes |
|---|---|
| `supabase.from('check_in').insert({ user_id, emotion, intensity, context })` | One of 5 fixed emotions, intensity 1–5. Strictly private — RLS allows only `user_id = auth.uid()` to ever read it back. |
| `supabase.from('user_focus').insert([...])`, `supabase.from('profiles').update({ social_energy, buddy_opt_in })` | One-time onboarding, folded into this tab. Skip if the profile is already complete. |

## Recharge

| Call | Notes |
|---|---|
| `supabase.from('challenge_assignment').select('*, challenges(*)').eq('user_id', uid).eq('for_date', today)` | Returns today's 2 recommended tasks. **Blocked on the feeling → task mapping**: `challenges.kind` is still `solo_reset / irl_challenge / community_moment`, not yet retagged to `breathe / walk / journal`. |
| `supabase.rpc('complete_assignment', { p_assignment_id })` | Atomic: marks the assignment complete, credits 10 points, updates the streak. Returns the new streak/points totals. |
| `supabase.rpc('reflect_assignment', { p_assignment_id, p_mood_before, p_mood_after, p_note, p_prompt_used })` | Optional. Requires the assignment already completed by the same caller. |
| `supabase.rpc('skip_assignment', { p_assignment_id })` | Declines today's task without breaking streak state. |
| `supabase.from('reflection').select('*, challenge_assignment(*, challenges(*))').eq('challenge_assignment.user_id', uid)` filtered to `challenges.kind = 'journal'`, ordered by `created_at desc` | Previous-journals view. No new table — reuses `reflection`, already RLS-scoped to the caller's own assignments. |

## Points

| Call | Notes |
|---|---|
| `supabase.from('streak').select('current_count, longest').eq('user_id', uid)` | Read-only. |
| `supabase.from('points_ledger').select('amount').eq('user_id', uid)` | Read-only; sum client-side. The ledger is append-only by design — there is no mutable balance column, so this can never drift under concurrent completions. |

## Settings

| Call | Notes |
|---|---|
| `supabase.from('profiles').update({ feed_opt_out })` | Community feed on/off. |
| `supabase.from('profiles').update({ notifications_enabled })` | Notifications on/off. Saves the preference only — there is no dispatch function yet, so nothing sends a push based on this today. |

## Open items

- Feeling → task mapping not yet locked (blocks the `challenges.kind` retag and the Recharge query above).
- Migrations 0001–0011 are validated locally/in CI but not yet pushed to the hosted Supabase project.
