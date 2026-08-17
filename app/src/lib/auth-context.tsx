import * as AuthSession from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';
import type { Session } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

export function resolveSchoolDomain(email: string): string | null {
  const normalized = email.toLowerCase();
  if (/@([a-z0-9-]+\.)*umd\.edu$/.test(normalized)) return 'umd.edu';
  if (normalized.endsWith('@gmail.com')) return 'umd.edu';
  return null;
}

async function bootstrapProfile(session: Session): Promise<Profile> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (existing) return existing as Profile;

  const email = session.user.email;
  if (!email) throw new Error('Signed-in account has no email.');

  const domain = resolveSchoolDomain(email);
  if (!domain) throw new Error(`Unsupported email domain for ${email}.`);

  const { data: school, error: schoolError } = await supabase
    .from('schools')
    .select('id')
    .eq('email_domain', domain)
    .single();

  if (schoolError || !school) {
    throw new Error('Could not resolve your school. Contact support.');
  }

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ id: session.user.id, school_id: school.id, email })
    .select('*')
    .single();

  if (insertError || !created) {
    throw insertError ?? new Error('Failed to create profile.');
  }

  return created as Profile;
}

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function createSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) return;

  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function handleSession(nextSession: Session | null) {
    setSession(nextSession);
    if (!nextSession) {
      setProfile(null);
      return;
    }
    try {
      const p = await bootstrapProfile(nextSession);
      setProfile(p);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profile.');
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session).finally(() => setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      handleSession(nextSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      error,
      async signInWithGoogle() {
        setError(null);
        const redirectTo =
          Platform.OS === 'web' ? window.location.origin : AuthSession.makeRedirectUri();

        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            skipBrowserRedirect: Platform.OS !== 'web',
          },
        });
        if (oauthError) throw oauthError;

        if (Platform.OS === 'web' || !data?.url) return;

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === 'success') {
          await createSessionFromUrl(result.url);
        }
      },
      async signOut() {
        await supabase.auth.signOut();
      },
      async refreshProfile() {
        if (!session) return;
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (data) setProfile(data as Profile);
      },
    }),
    [session, profile, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
