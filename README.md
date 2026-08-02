# Spark

An emotion check-in app: check in, get routed to one of three options (a
Solo Reset, a Real-World Challenge, or a Community Moment), complete it,
reflect, and see your streak update — end to end in under three minutes.

Full rationale for every choice below lives in the Sprint 5 Technical
Architecture doc (team-reviewed; not duplicated here to avoid drift). This
README covers what's needed to run the code.

## Repository structure

```
spark/
  app/                     Expo / React Native / TypeScript application
    screens/                 Check-in, today, feed, and profile screens
    components/               Shared UI components
    navigation/               React Navigation stack (Wave 1 wired; Wave 2 pending)
    lib/supabase.ts           Typed client
    lib/database.types.ts     Generated from the database schema -- do not hand-edit
  supabase/
    migrations/               Versioned SQL migrations (source of truth for the schema)
    functions/
      recommend-nightly/        Tier 2 recommendation job (not yet implemented)
      dispatch-push/             Notification dispatch (not yet implemented)
    seed.sql                  Sample data: one campus, forty challenges, five test accounts
    config.toml                Local Supabase CLI configuration
  docs/                      Screen data contract and related planning materials
  .github/workflows/        CI: type-checking, linting, migration validation
```

## First-time setup

Prerequisites: Node.js 20+, Docker Desktop, and Expo Go installed on a test device.

```bash
npm install -g supabase

git clone https://github.com/linuteresa/spark.git && cd spark

cd app && npm install && cd ..

# Start a local instance of Postgres, Auth, and Storage
supabase start

# Apply all migrations and load sample data
supabase db reset

# Generate a typed client from the current schema
supabase gen types typescript --local > app/lib/database.types.ts

# Copy the environment template and populate it with the values `supabase start` prints
cp app/.env.example app/.env

# Run the application and open it with Expo Go
cd app && npx expo start
```

Test accounts (from `supabase/seed.sql`, password `sparkdemo123`):
`amara@demo.spark.edu`, `devon@demo.spark.edu`, `priya@demo.spark.edu`,
`malik@demo.spark.edu`, `yuki@demo.spark.edu`. Amara has a completed
check-in through reflection already seeded, so Points & Streak has data to
show without doing anything first.

**After `npm install`, commit the resulting `app/package-lock.json`.** CI
runs `npm ci`, which requires a committed lockfile — it wasn't generated as
part of this scaffold since this environment has no Node install.

## To connect this repo to the team's Supabase project

This scaffold was written against
[dfvwrduvdewxseprvakw](https://supabase.com/dashboard/project/dfvwrduvdewxseprvakw).
To push the migrations there instead of running everything locally:

```bash
supabase link --project-ref dfvwrduvdewxseprvakw
supabase db push
```

Get the project's URL and anon key from Project Settings -> API and put
them in `app/.env`.

## Working agreements

- **Schema changes go through migrations.** Never edit the schema by hand
  against a running database; add a new file under `supabase/migrations/`.
- **Access policies ship with their tables.** Every new table is introduced
  together with its row-level security policy in the same migration.
- **Branching model.** Short-lived feature branches merged within the sprint.
- **Sprint cadence.** Two-week sprints, each producing a reviewable build.

## Status

Wave 1 (the core loop) is scaffolded: Home / Check-In Wheel, Your Options,
Daily IRL Challenge, Complete & Reflect, and Points & Streak. See
[`docs/screen-data-contract.md`](docs/screen-data-contract.md) for what each
screen reads and writes, Wave 2's scope, and the entities that are schema-
ready but deliberately not built yet (Living Companion, Buddy System).
