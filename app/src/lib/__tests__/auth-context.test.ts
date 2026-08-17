// resolveSchoolDomain is the client-side half of UMD-only signup restriction
// (the other half is the Supabase Auth Hook). Real bugs were found in the
// Auth Hook's own domain check earlier in this project (wrong payload path,
// missed terpmail.umd.edu) -- these tests lock down the same boundary here.
import { resolveSchoolDomain } from '../auth-context';

describe('resolveSchoolDomain', () => {
  it('accepts a plain @umd.edu address', () => {
    expect(resolveSchoolDomain('student@umd.edu')).toBe('umd.edu');
  });

  it('accepts @terpmail.umd.edu, the real UMD undergrad domain', () => {
    expect(resolveSchoolDomain('student@terpmail.umd.edu')).toBe('umd.edu');
  });

  it('is case-insensitive', () => {
    expect(resolveSchoolDomain('STUDENT@UMD.EDU')).toBe('umd.edu');
  });

  it('allows @gmail.com as a temporary testing exception', () => {
    expect(resolveSchoolDomain('tester@gmail.com')).toBe('umd.edu');
  });

  it('rejects a lookalike domain that merely ends in the right substring', () => {
    // "evil-umd.edu" contains "umd.edu" as a substring but is not a real
    // subdomain of umd.edu -- must not be treated as a UMD address.
    expect(resolveSchoolDomain('attacker@evil-umd.edu')).toBeNull();
  });

  it('rejects a domain with no dot separator before umd.edu', () => {
    expect(resolveSchoolDomain('attacker@notumd.edu')).toBeNull();
  });

  it('rejects an unrelated domain entirely', () => {
    expect(resolveSchoolDomain('someone@random.com')).toBeNull();
  });

  it('rejects a string with no @ at all', () => {
    expect(resolveSchoolDomain('not-an-email')).toBeNull();
  });
});
