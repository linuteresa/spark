import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { EmotionHistory } from '@/components/profile/emotion-history';
import { PointsBreakdown } from '@/components/profile/points-breakdown';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { CheckIn, PointsLedgerEntry } from '@/lib/types';

export default function ProfileScreen() {
  const router = useRouter();
  const { session, profile, signOut } = useAuth();
  const [ledger, setLedger] = useState<PointsLedgerEntry[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const [ledgerRes, checkInRes] = await Promise.all([
        supabase
          .from('points_ledger')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('check_in')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(30),
      ]);
      setLedger((ledgerRes.data as PointsLedgerEntry[]) ?? []);
      setCheckIns((checkInRes.data as CheckIn[]) ?? []);
      setLoading(false);
    })();
  }, [session]);

  return (
    <ScreenContainer>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {profile?.email}
      </ThemedText>

      {loading && <ActivityIndicator />}

      {!loading && (
        <>
          <ThemedText type="subtitle" style={styles.sectionHeading}>
            Points
          </ThemedText>
          <PointsBreakdown ledger={ledger} />

          <ThemedText type="subtitle" style={styles.sectionHeading}>
            Emotion history
          </ThemedText>
          <EmotionHistory checkIns={checkIns} />

          <Pressable onPress={() => router.push('/(tabs)/recharge?tab=journal')} style={styles.journalLink}>
            <ThemedText type="linkPrimary">View journal entries →</ThemedText>
          </Pressable>

          <View style={styles.divider} />

          <Button label="Log out" onPress={signOut} variant="outline" color="#C41E3A" />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: Spacing.three,
  },
  journalLink: {
    marginTop: Spacing.three,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: Spacing.four,
  },
});
