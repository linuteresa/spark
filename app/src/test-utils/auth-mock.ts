/* global jest */
// Mock replacement for '@/lib/auth-context' used via jest.mock, so components
// that call useAuth() can be rendered without a real AuthProvider tree.
import type { Session } from '@supabase/supabase-js';

import type { Profile } from '@/lib/types';

export interface MockAuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const mockAuthState: MockAuthState = {
  session: null,
  profile: null,
  loading: false,
  error: null,
  signInWithGoogle: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
  refreshProfile: jest.fn(() => Promise.resolve()),
};

export function setMockAuthState(partial: Partial<MockAuthState>) {
  Object.assign(mockAuthState, partial);
}

export function resetMockAuthState() {
  setMockAuthState({
    session: null,
    profile: null,
    loading: false,
    error: null,
    signInWithGoogle: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    refreshProfile: jest.fn(() => Promise.resolve()),
  });
}

export const useAuth = () => mockAuthState;
