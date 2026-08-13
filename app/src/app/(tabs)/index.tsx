import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { HeaderBanner } from '@/components/home/header-banner';
import { PointsCard } from '@/components/home/points-card';
import { TaskCard } from '@/components/home/task-card';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { HomeTheme } from '@/constants/palette';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { ChallengeAssignment, CheckIn, Streak } from '@/lib/types';

function startOfToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function HomeScreen() {
  const { session } = useAuth();
  const [latestCheckIn, setLatestCheckIn] = useState<CheckIn | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [pointsToday, setPointsToday] = useState(0);
  const [assignment, setAssignment] = useState<ChallengeAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    setError(null);
    try {
      const today = startOfToday();

      const [checkInRes, streakRes, ledgerRes, assignmentRes] = await Promise.all([
        supabase
          .from('check_in')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('streak')
          .select('user_id, current_count, longest, last_date')
          .eq('user_id', session.user.id)
          .maybeSingle(),
        supabase
          .from('points_ledger')
          .select('amount, created_at')
          .eq('user_id', session.user.id)
          .gte('created_at', `${today}T00:00:00.000Z`),
        supabase
          .from('challenge_assignment')
          .select('*, action_matrix(*)')
          .eq('user_id', session.user.id)
          .eq('for_date', today)
          .maybeSingle(),
      ]);

      if (checkInRes.error) throw checkInRes.error;
      if (streakRes.error) throw streakRes.error;
      if (ledgerRes.error) throw ledgerRes.error;
      if (assignmentRes.error) throw assignmentRes.error;

      setLatestCheckIn((checkInRes.data as CheckIn) ?? null);
      setStreak((streakRes.data as Streak) ?? null);
      setPointsToday((ledgerRes.data ?? []).reduce((sum, row) => sum + row.amount, 0));
      setAssignment((assignmentRes.data as ChallengeAssignment) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load Home.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  async function completeTask() {
    if (!assignment) return;
    setCompleting(true);
    try {
      const { error: rpcError } = await supabase.rpc('complete_assignment', {
        p_assignment_id: assignment.id,
      });
      if (rpcError) throw rpcError;
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not complete task.');
    } finally {
      setCompleting(false);
    }
  }

  return (
    <ScreenContainer backgroundColor={HomeTheme.background}>
      {loading && <ActivityIndicator />}
      {error && <ThemedText style={{ color: '#cf222e' }}>{error}</ThemedText>}

      {!loading && (
        <>
          <HeaderBanner emotion={latestCheckIn?.emotion ?? null} streakDays={streak?.current_count ?? 0} />
          <PointsCard pointsToday={pointsToday} />
          <TaskCard assignment={assignment} onComplete={completeTask} completing={completing} />
        </>
      )}
    </ScreenContainer>
  );
}
