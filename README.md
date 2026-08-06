# Spark

Spark is a wellness app for University of Maryland students: check in with how you're feeling, get a task recommended for you (breathe, walk, or journal), and build a streak. Built for the **xFoundry** accelerator, where the team is pitching Spark for funding.


## Structure

- `supabase/migrations/` — schema, RLS policies, and functions, in order
- `supabase/seed.sql` — sample data (one school, challenge catalog, test accounts)
- `supabase/config.toml` — local Supabase CLI config, including the signup domain-restriction Auth Hook
- `.github/workflows/ci.yml` — replays all migrations against a real Postgres + Auth container on every push/PR
- `docs/api-contract.md`, `docs/screen-data-contract.md` — the frontend data contract (separate repo builds against this)

## Local setup

```
supabase start
supabase db reset
```

## Versioning

Every migration set actually pushed to the hosted Supabase project
(`supabase db push`) gets a tag on `main`: `vMAJOR.MINOR.PATCH`. Bump PATCH
for additive migrations (new column, new function), MINOR for a new table
or a breaking RLS/policy change, MAJOR only for a schema reset. The tag
marks what's live in production at that point — if something needs a
rollback, it's `git checkout <tag>` and `supabase db push` from there.

```
git tag -a v0.1.0 -m "Migrations 0001-0011: core loop + notifications + UMD signup hook"
git push origin v0.1.0
```
