import { StyleSheet, View } from 'react-native';

import { EmotionWheel } from '@/components/check-in/emotion-wheel';
import { WeekStrip } from '@/components/check-in/week-strip';
import { ThemedText } from '@/components/themed-text';
import { CircleArrowButton } from '@/components/ui/circle-icon-button';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import type { Emotion } from '@/lib/types';

interface MoodStepProps {
  value: Emotion | null;
  onChange: (emotion: Emotion) => void;
  onNext: () => void;
}

export function MoodStep({ value, onChange, onNext }: MoodStepProps) {
  return (
    <View style={styles.container}>
      <WeekStrip />
      <ThemedText type="subtitle" style={styles.heading}>
        How are you feeling today?
      </ThemedText>

      <EmotionWheel value={value} onChange={onChange} />

      <CircleArrowButton onPress={onNext} disabled={!value} color={HomeTheme.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  heading: {
    textAlign: 'center',
  },
});
