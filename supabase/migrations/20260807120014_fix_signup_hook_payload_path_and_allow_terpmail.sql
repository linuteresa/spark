-- Two bugs fixed at once, found via a live test that rejected even a real
-- @umd.edu account:
--
-- 1. The hook read event->>'email', but Supabase's actual "before-user-created"
--    payload nests it under event->'user'->>'email' (metadata/user shape,
--    see docs/auth/auth-hooks/before-user-created-hook). The top-level
--    lookup was always NULL, so every signup was rejected regardless of
--    domain -- this is why even a real @umd.edu account failed.
-- 2. UMD undergrads sign up with @terpmail.umd.edu, not @umd.edu. The old
--    regex only matched the exact @umd.edu suffix. New pattern accepts any
--    *.umd.edu subdomain (so @umd.edu and @terpmail.umd.edu both pass) while
--    still rejecting lookalikes like @evil-umd.edu or @umd.edu.evil.com.
--
-- Also switched from RAISE EXCEPTION to the documented jsonb error-response
-- shape, which surfaces a clean 403 + message instead of an opaque 500.
--
-- Verified directly against the hosted project: student@umd.edu and
-- sebadis@terpmail.umd.edu both allowed; someone@gmail.com and
-- attacker@evil-umd.edu both still rejected.

create or replace function public.restrict_signup_to_umd_domain(event jsonb)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_email text := event -> 'user' ->> 'email';
begin
  if v_email is null or v_email !~* '@([a-z0-9-]+\.)*umd\.edu$' then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'message', 'Only @umd.edu or @terpmail.umd.edu addresses may sign up for Spark.',
        'http_code', 403
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;
