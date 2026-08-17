/* global jest */
// Mock replacement for '@/lib/supabase' used via jest.mock in test files. Mimics
// just enough of the real query-builder's chaining + thenable shape to drive
// component tests without a network call. Configure per test with queueResponse.

type QueryResponse<T = unknown> = { data: T | null; error: { message: string } | null };

const responseQueues = new Map<string, QueryResponse[]>();
let currentSession: unknown = null;
type AuthChangeCallback = (event: string, session: unknown) => void;
const authCallbacks: AuthChangeCallback[] = [];

export function queueResponse(table: string, response: QueryResponse) {
  const queue = responseQueues.get(table) ?? [];
  queue.push(response);
  responseQueues.set(table, queue);
}

function nextResponse(table: string): QueryResponse {
  const queue = responseQueues.get(table);
  if (!queue || queue.length === 0) return { data: null, error: null };
  return queue.shift()!;
}

export function setMockSession(session: unknown) {
  currentSession = session;
  authCallbacks.forEach((cb) => cb(session ? 'SIGNED_IN' : 'SIGNED_OUT', session));
}

export function resetSupabaseMock() {
  responseQueues.clear();
  currentSession = null;
  authCallbacks.length = 0;
  supabase.from.mockClear();
  supabase.auth.getSession.mockClear();
  supabase.auth.onAuthStateChange.mockClear();
  supabase.auth.signInWithOAuth.mockClear();
  supabase.auth.signOut.mockClear();
  supabase.auth.setSession.mockClear();
}

const CHAIN_METHODS = [
  'select',
  'insert',
  'update',
  'upsert',
  'delete',
  'eq',
  'neq',
  'in',
  'order',
  'range',
  'limit',
  'gte',
  'lte',
] as const;

function makeQueryBuilder(table: string) {
  const builder: Record<string, unknown> = {};
  for (const method of CHAIN_METHODS) {
    builder[method] = jest.fn(() => builder);
  }
  builder.single = jest.fn(() => Promise.resolve(nextResponse(table)));
  builder.maybeSingle = jest.fn(() => Promise.resolve(nextResponse(table)));
  builder.then = (onResolve: (r: QueryResponse) => unknown, onReject?: (e: unknown) => unknown) =>
    Promise.resolve(nextResponse(table)).then(onResolve, onReject);
  builder.catch = (onReject: (e: unknown) => unknown) =>
    Promise.resolve(nextResponse(table)).catch(onReject);
  return builder;
}

export const supabase = {
  from: jest.fn((table: string) => makeQueryBuilder(table)),
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: { session: currentSession } })),
    onAuthStateChange: jest.fn((cb: AuthChangeCallback) => {
      authCallbacks.push(cb);
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    }),
    signInWithOAuth: jest.fn(() => Promise.resolve({ data: { url: null }, error: null })),
    signOut: jest.fn(() => {
      setMockSession(null);
      return Promise.resolve({ error: null });
    }),
    setSession: jest.fn(() => Promise.resolve({ error: null })),
  },
};
