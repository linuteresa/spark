-- Temporary widening, per explicit product direction: allow @gmail.com
-- alongside @umd.edu / @terpmail.umd.edu "for now" (testing/demo access,
-- e.g. for people without a UMD account to try the app). To revert to
-- UMD-only later, drop the gmail.com branch below in a new migration --
-- never edit an already-applied migration file in place.

create or replace function public.restrict_signup_to_umd_domain(event jsonb)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_email text := event -> 'user' ->> 'email';
begin
  if v_email is null or (
    v_email !~* '@([a-z0-9-]+\.)*umd\.edu$'
    and v_email !~* '@gmail\.com$'
  ) then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'message', 'Only @umd.edu, @terpmail.umd.edu, or @gmail.com addresses may sign up for Spark.',
        'http_code', 403
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;
