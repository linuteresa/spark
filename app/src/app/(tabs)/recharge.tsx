import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BreatheTab } from '@/components/recharge/breathe-tab';
import { JournalTab } from '@/components/recharge/journal-tab';
import { MoveTab } from '@/components/recharge/move-tab';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { RechargeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';

type Segment = 'breathe' | 'move' | 'journal';

const SEGMENTS: { value: Segment; label: string; description: string }[] = [
  { value: 'breathe', label: 'Breathe', description: 'Slow down with a guided breathing pattern.' },
  { value: 'move', label: 'Move', description: 'Shake it out with a quick movement break.' },
  { value: 'journal', label: 'Journal', description: 'Write it out, prompted or freeform.' },
];

export default function RechargeScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [segment, setSegment] = useState<Segment>(tab === 'journal' ? 'journal' : 'breathe');

  return (
    <ScreenContainer backgroundColor={RechargeTheme.background}>
      <ThemedText type="title" style={{ color: RechargeTheme.text }}>
        RECHARGE
      </ThemedText>

      <View style={styles.cardList}>
        {SEGMENTS.map((s, i) => {
          const isActive = segment === s.value;
          return (
            <Pressable
              key={s.value}
              onPress={() => setSegment(s.value)}
              style={[
                styles.card,
                { backgroundColor: RechargeTheme.card },
                isActive && { borderColor: RechargeTheme.accent },
              ]}>
              <View style={[styles.badge, { backgroundColor: RechargeTheme.accent }]}>
                <ThemedText type="smallBold" style={styles.badgeLabel}>
                  {i + 1}
                </ThemedText>
              </View>
              <View style={styles.cardText}>
                <ThemedText type="smallBold">{s.label}</ThemedText>
                <ThemedText type="small" style={{ color: RechargeTheme.textSecondary }}>
                  {s.description}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {segment === 'breathe' && <BreatheTab />}
      {segment === 'move' && <MoveTab />}
      {segment === 'journal' && <JournalTab />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardList: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.four,
    padding: Spacing.three,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    color: '#FFFFFF',
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
});
