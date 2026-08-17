describe('env', () => {
  const originalUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

  afterEach(() => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = originalUrl;
    jest.resetModules();
  });

  it('exposes the configured Supabase URL and anon key', () => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- must re-require after resetModules to observe the new module evaluation
    const { env } = require('@/config/env');
    expect(env.supabaseUrl).toBe(originalUrl);
    expect(env.supabaseAnonKey).toBeTruthy();
  });

  it('throws a clear error when a required env var is missing', () => {
    jest.resetModules();
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- must re-require after resetModules to observe the new module evaluation
    expect(() => require('@/config/env')).toThrow(/Missing required env var EXPO_PUBLIC_SUPABASE_URL/);
  });
});
