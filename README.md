# Spark

Spark is a wellness app for University of Maryland students: check in with how you're feeling, get a task recommended for you (breathe, walk, or journal), and build a streak. Built for the **xFoundry** accelerator, where the team is pitching Spark for funding.

This repo is the backend only — Postgres schema, row-level security policies, and SQL functions, managed as [Supabase](https://supabase.com) migrations. The frontend (Expo / React Native) lives in a separate repo.

## Structure

- `supabase/migrations/` — schema, RLS policies, and functions, in order
- `supabase/seed.sql` — sample data (one school, challenge catalog, test accounts)
- `supabase/config.toml` — local Supabase CLI config, including the signup domain-restriction Auth Hook
- `.github/workflows/ci.yml` — replays all migrations against a real Postgres + Auth container on every push/PR

## Local setup

```
supabase start
supabase db reset
```
