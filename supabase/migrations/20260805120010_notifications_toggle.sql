-- Settings: notifications on/off, alongside the existing feed_opt_out toggle
-- (0001). This only stores the preference -- there is no dispatch function
-- yet, so nothing sends a push based on this column today (see architecture
-- doc Section 12.3: "treat delivery as a fast-follow, not a blocker").

alter table profiles
  add column notifications_enabled boolean not null default true;
