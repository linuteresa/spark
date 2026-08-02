# recommend-nightly

Not implemented in this scaffold pass. Placeholder per the repository
structure in the technical architecture doc.

Scope for when this is built: Tier 1 (MVP, in scope) is a rules-based
scoring function that can live entirely in PostgreSQL (pg_cron calling a
`generate_daily_assignments()`-style function) rather than requiring this
Edge Function at all. Tier 2 (post-launch, out of scope for MVP per the
SCOPE PARAMETERS) is where this directory becomes load-bearing: a scheduled
job that calls Claude Haiku via the Message Batches API and writes ranked
`challenge_assignment` rows. See `docs/screen-data-contract.md` and Section 4
of the architecture doc for the two-tier design.
