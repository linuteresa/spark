import { act, render, screen, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { fakeProfile, fakeSession, fakeUser } from '@/test-utils/fixtures';
import { queueResponse, resetSupabaseMock, setMockSession, supabase as mockSupabaseClient } from '@/test-utils/supabase-mock';

import { AuthProvider, useAuth } from '@/lib/auth-context';

jest.mock('@/lib/supabase', () => ({ supabase: mockSupabaseClient }));
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'spark://redirect'),
}));

let latestAuth: ReturnType<typeof useAuth> | null = null;

function Probe() {
  const auth = useAuth();
  useEffect(() => {
    latestAuth = auth;
  });
  return (
    <View>
      <Text testID="loading">{String(auth.loading)}</Text>
      <Text testID="session">{auth.session ? auth.session.user.id : 'none'}</Text>
      <Text testID="profile">{auth.profile ? auth.profile.display_name ?? '' : 'none'}</Text>
      <Text testID="error">{auth.error ?? 'none'}</Text>
    </View>
  );
}

function renderProbe() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
}

describe('AuthProvider / useAuth', () => {
  beforeEach(() => {
    resetSupabaseMock();
    latestAuth = null;
  });

  it('resolves to no session and stops loading when signed out', async () => {
    renderProbe();
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));
    expect(screen.getByTestId('session').props.children).toBe('none');
    expect(screen.getByTestId('profile').props.children).toBe('none');
  });

  it('loads an existing profile row for a signed-in session', async () => {
    setMockSession(fakeSession);
    queueResponse('profiles', { data: fakeProfile, error: null });

    renderProbe();

    await waitFor(() => expect(screen.getByTestId('profile').props.children).toBe(fakeProfile.display_name));
    expect(screen.getByTestId('session').props.children).toBe(fakeUser.id);
    expect(screen.getByTestId('error').props.children).toBe('none');
  });

  it('bootstraps a new profile row for a first-time UMD sign-in', async () => {
    setMockSession(fakeSession);
    queueResponse('profiles', { data: null, error: null }); // no existing profile
    queueResponse('schools', { data: { id: fakeProfile.school_id }, error: null });
    queueResponse('profiles', { data: fakeProfile, error: null }); // created row

    renderProbe();

    await waitFor(() => expect(screen.getByTestId('profile').props.children).toBe(fakeProfile.display_name));
  });

  it('surfaces an error for an unsupported (non-UMD) email domain', async () => {
    setMockSession({ ...fakeSession, user: { ...fakeUser, email: 'person@notumd.edu' } });
    queueResponse('profiles', { data: null, error: null });

    renderProbe();

    await waitFor(() => expect(screen.getByTestId('error').props.children).not.toBe('none'));
    expect(screen.getByTestId('profile').props.children).toBe('none');
  });

  it('surfaces an error when the school lookup fails', async () => {
    setMockSession(fakeSession);
    queueResponse('profiles', { data: null, error: null });
    queueResponse('schools', { data: null, error: { message: 'not found' } });

    renderProbe();

    await waitFor(() => expect(screen.getByTestId('error').props.children).toBe('Could not resolve your school. Contact support.'));
  });

  it('signOut calls the Supabase client', async () => {
    renderProbe();
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      await latestAuth!.signOut();
    });

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('refreshProfile re-fetches the profile row for the current session', async () => {
    setMockSession(fakeSession);
    queueResponse('profiles', { data: fakeProfile, error: null });
    renderProbe();
    await waitFor(() => expect(screen.getByTestId('profile').props.children).toBe(fakeProfile.display_name));

    queueResponse('profiles', { data: { ...fakeProfile, display_name: 'Updated Name' }, error: null });
    await act(async () => {
      await latestAuth!.refreshProfile();
    });

    await waitFor(() => expect(screen.getByTestId('profile').props.children).toBe('Updated Name'));
  });

  it('refreshProfile is a no-op when there is no session', async () => {
    renderProbe();
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      await latestAuth!.refreshProfile();
    });

    expect(screen.getByTestId('profile').props.children).toBe('none');
  });

  it('signInWithGoogle calls signInWithOAuth with the google provider', async () => {
    renderProbe();
    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      await latestAuth!.signInWithGoogle();
    });

    expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' })
    );
  });

  it('throws when useAuth is called outside an AuthProvider', () => {
    function Bare() {
      useAuth();
      return null;
    }
    expect(() => render(<Bare />)).toThrow('useAuth must be used within AuthProvider');
  });
});
