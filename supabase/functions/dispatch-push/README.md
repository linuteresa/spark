# dispatch-push

Not implemented in this scaffold pass. Placeholder per the repository
structure in the technical architecture doc.

Sends daily reminders, streak-at-risk nudges, and buddy notifications via
Expo's push service (`push_token` table, migration `0007_push_and_events.sql`),
respecting quiet hours server-side. Out of scope for the Wave-1 screens this
pass scaffolds; wire up once notification preferences (Settings/Profile,
Wave 2) exist.
