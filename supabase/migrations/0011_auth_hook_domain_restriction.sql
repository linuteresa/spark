-- "Before User Created" Auth Hook: server-side enforcement that only
-- @umd.edu accounts can sign up. The client-side `hd=umd.edu` param on
-- signInWithOAuth (see docs/api-contract.md) is a UX hint only -- a student
-- can strip it and authenticate with any Google account, so this is the
-- actual enforcement point. Runs before the auth.users row is created.
--
-- Per Supabase's Auth Hook security model, hook functions are callable only
-- by supabase_auth_admin, not by any client-facing role.
create or replace function public.restrict_signup_to_umd_domain(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  v_email text := event ->> 'email';
begin
  if v_email is null or v_email !~* '@umd\.edu$' then
    raise exception 'Only @umd.edu email addresses may sign up for Spark';
  end if;

  return event;
end;
$$;

grant execute on function public.restrict_signup_to_umd_domain(jsonb) to supabase_auth_admin;
revoke execute on function public.restrict_signup_to_umd_domain(jsonb) from authenticated, anon, public;

-- Registered for local dev via supabase/config.toml
-- ([auth.hook.before_user_created]). On the hosted project
-- (dfvwrduvdewxseprvakw) this same hook must also be enabled from the
-- Dashboard under Authentication -> Hooks -- that step needs dashboard
-- access this environment doesn't have.
