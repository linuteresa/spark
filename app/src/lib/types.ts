export type Emotion = 'anxious' | 'sad' | 'foggy' | 'restless' | 'okay' | 'happy';

export type Pillar = 'social' | 'education' | 'career' | 'health_personal';

export type EnergyLevel = 1 | 2 | 3;

export interface School {
  id: string;
  name: string;
  email_domain: string;
  timezone: string;
  created_at: string;
}

export interface Profile {
  id: string;
  school_id: string;
  email: string;
  display_name: string | null;
  social_energy: number | null;
  feed_opt_out: boolean;
  buddy_opt_in: boolean;
  notifications_enabled: boolean;
  created_at: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  emotion: Emotion;
  intensity: number;
  context: string | null;
  energy_level: EnergyLevel | null;
  pillar: Pillar | null;
  substressor_code: string | null;
  created_at: string;
}

export interface SubStressor {
  code: string;
  pillar: Pillar;
  label: string;
  sort_order: number;
}

export interface ActionMatrixEntry {
  id: string;
  substressor_code: string;
  energy_level: EnergyLevel;
  action_text: string;
}

export interface ChallengeAssignment {
  id: string;
  user_id: string;
  for_date: string;
  rank: number;
  reason: string | null;
  completed_at: string | null;
  skipped_at: string | null;
  created_at: string;
  ai_note: string | null;
  action_matrix: ActionMatrixEntry | null;
}

export interface Reflection {
  assignment_id: string;
  mood_before: number;
  mood_after: number;
  note: string | null;
  prompt_used: string | null;
  created_at: string;
}

export type ReactionType = 'support' | 'relate' | 'proud' | 'sending_love';

export interface FeedPost {
  id: string;
  user_id: string;
  school_id: string;
  assignment_id: string | null;
  body: string | null;
  media_url: string | null;
  created_at: string;
  profiles: { display_name: string | null; email: string } | null;
}

export interface FeedComment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string | null; email: string } | null;
}

export interface FeedReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export type EventKind = 'club' | 'student';

export interface StudentEvent {
  id: string;
  school_id: string;
  created_by: string;
  kind: EventKind;
  title: string;
  about: string | null;
  notes: string | null;
  event_date: string;
  created_at: string;
}

export const REACTIONS: { value: ReactionType; emoji: string; label: string }[] = [
  { value: 'support', emoji: '🤗', label: 'Support' },
  { value: 'relate', emoji: '🙌', label: 'Relate' },
  { value: 'proud', emoji: '⭐', label: 'Proud' },
  { value: 'sending_love', emoji: '💛', label: 'Love' },
];

export interface JournalEntry {
  id: string;
  user_id: string;
  prompt_used: string | null;
  body: string;
  created_at: string;
}

export interface Streak {
  user_id: string;
  current_count: number;
  longest: number;
  last_date: string | null;
}

export interface PointsLedgerEntry {
  id: string;
  user_id: string;
  source: string;
  amount: number;
  created_at: string;
}

export const EMOTIONS: { value: Emotion; label: string }[] = [
  { value: 'anxious', label: 'Anxious' },
  { value: 'sad', label: 'Sad' },
  { value: 'foggy', label: 'Foggy' },
  { value: 'restless', label: 'Restless' },
  { value: 'okay', label: 'Okay' },
  { value: 'happy', label: 'Happy' },
];

export const PILLARS: { value: Pillar; label: string; description: string }[] = [
  { value: 'social', label: 'Social', description: 'Friends, roommates, belonging, crowds' },
  { value: 'education', label: 'Education', description: 'Classes, exams, professors, projects' },
  { value: 'career', label: 'Career', description: 'Internships, resumes, interviews, networking' },
  {
    value: 'health_personal',
    label: 'Health & Personal',
    description: 'Sleep, energy, routine, money',
  },
];

export const ENERGY_LEVELS: { value: EnergyLevel; label: string }[] = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
];
