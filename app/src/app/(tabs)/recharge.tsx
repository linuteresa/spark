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

const SEGMENTS: { value: Segment; label: string }[] = [
  { value: 'breathe', label: 'Breathe' },
  { value: 'move', label: 'Move' },
  { value: 'journal', label: 'Journal' },
];

export default function RechargeScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [segment, setSegment] = useState<Segment>(tab === 'journal' ? 'journal' : 'breathe');

  return (
    <ScreenContainer backgroundColor={RechargeTheme.background}>
      <ThemedText type="title" style={{ color: RechargeTheme.text }}>
        RECHARGE
      </ThemedText>

      <View style={[styles.toggleRow, { borderColor: RechargeTheme.accent }]}>
        {SEGMENTS.map((s) => {
          const isActive = segment === s.value;
          return (
            <Pressable
              key={s.value}
              onPress={() => setSegment(s.value)}
              style={[styles.toggle, isActive && { backgroundColor: RechargeTheme.accent }]}>
              <ThemedText
                type="smallBold"
                style={isActive ? styles.activeLabel : { color: RechargeTheme.accent }}>
                {s.label}
              </ThemedText>
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
  toggleRow: {
    flexDirection: 'row',
    borderRadius: Spacing.five,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: Spacing.three,
  },
  toggle: {
    flex: 1,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
});
