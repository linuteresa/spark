/* global jest */
// Dummy values so modules that construct the Supabase client at import time
// (e.g. lib/supabase.ts) don't throw during test collection. Never real
// credentials -- tests never make a real network call to Supabase.
process.env.EXPO_PUBLIC_SUPABASE_URL ??= 'https://test-project.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??= 'test-anon-key';

// AsyncStorage's native module doesn't exist under Jest -- use the package's
// own official mock (recommended by their docs) instead of the real one.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
