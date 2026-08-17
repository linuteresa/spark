// Fake data for unit tests only. Nothing here touches a real Supabase project --
// these are plain in-memory objects fed into mocked query responses (see
// supabase-mock.ts), never real accounts or a real network call.
import type {
  ChallengeAssignment,
  CheckIn,
  Emotion,
  EventKind,
  FeedComment,
  FeedPost,
  FeedReaction,
  JournalEntry,
  Pillar,
  PointsLedgerEntry,
  Profile,
  StudentEvent,
} from '@/lib/types';
import type { Session, User } from '@supabase/supabase-js';

export const fakeUser: User = {
  id: 'fake-user-1',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00.000Z',
  email: 'terp.one@umd.edu',
} as User;

export const fakeUser2: User = {
  ...fakeUser,
  id: 'fake-user-2',
  email: 'terp.two@umd.edu',
} as User;

export const fakeSession: Session = {
  access_token: 'fake-access-token',
  refresh_token: 'fake-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: fakeUser,
} as Session;

export const fakeProfile: Profile = {
  id: fakeUser.id,
  school_id: 'fake-school-umd',
  email: fakeUser.email!,
  display_name: 'Test Terp',
  social_energy: 2,
  feed_opt_out: false,
  buddy_opt_in: false,
  notifications_enabled: true,
  created_at: '2026-01-01T00:00:00.000Z',
};

export const fakeCheckIn: CheckIn = {
  id: 'fake-checkin-1',
  user_id: fakeUser.id,
  emotion: 'okay' as Emotion,
  context: null,
  energy_level: 2,
  pillar: 'education' as Pillar,
  substressor_code: 'exam-stress',
  created_at: '2026-01-01T09:00:00.000Z',
};

export const fakeAssignment: ChallengeAssignment = {
  id: 'fake-assignment-1',
  user_id: fakeUser.id,
  for_date: '2026-01-01',
  rank: 1,
  reason: null,
  completed_at: null,
  skipped_at: null,
  created_at: '2026-01-01T09:00:00.000Z',
  ai_note: 'Small steps count today.',
  action_matrix: {
    id: 'fake-action-1',
    substressor_code: 'exam-stress',
    energy_level: 2,
    action_text: 'Take a 10-minute walk between study blocks.',
  },
};

export const fakeFeedPost: FeedPost = {
  id: 'fake-post-1',
  user_id: fakeUser.id,
  school_id: fakeProfile.school_id,
  assignment_id: null,
  body: 'Made it through my first exam week check-in!',
  media_url: null,
  created_at: '2026-01-01T10:00:00.000Z',
  profiles: { display_name: fakeProfile.display_name, email: fakeProfile.email },
};

export const fakeFeedReaction: FeedReaction = {
  id: 'fake-reaction-1',
  post_id: fakeFeedPost.id,
  user_id: fakeUser2.id,
  reaction_type: 'support',
  created_at: '2026-01-01T10:05:00.000Z',
};

export const fakeFeedComment: FeedComment = {
  id: 'fake-comment-1',
  post_id: fakeFeedPost.id,
  user_id: fakeUser2.id,
  body: 'Proud of you!',
  created_at: '2026-01-01T10:10:00.000Z',
  profiles: { display_name: 'Second Terp', email: fakeUser2.email! },
};

export const fakeStudentEvent: StudentEvent = {
  id: 'fake-event-1',
  school_id: fakeProfile.school_id,
  created_by: fakeUser.id,
  kind: 'student' as EventKind,
  title: 'Study group @ McKeldin',
  about: 'Bring your notes, we will do a group review.',
  notes: null,
  event_date: '2099-01-01',
  created_at: '2026-01-01T00:00:00.000Z',
};

export const fakeJournalEntry: JournalEntry = {
  id: 'fake-journal-1',
  user_id: fakeUser.id,
  prompt_used: null,
  body: 'Today was a lot, but I got through it.',
  created_at: '2026-01-01T20:00:00.000Z',
};

export const fakePointsLedger: PointsLedgerEntry[] = [
  { id: 'fake-ledger-1', user_id: fakeUser.id, source: 'daily_check_in', amount: 10, created_at: new Date().toISOString() },
  { id: 'fake-ledger-2', user_id: fakeUser.id, source: 'challenge_completion', amount: 30, created_at: new Date().toISOString() },
];
