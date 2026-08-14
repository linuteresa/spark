import { StyleSheet, View } from 'react-native';

import { EmotionWheel } from '@/components/check-in/emotion-wheel';
import { WeekStrip } from '@/components/check-in/week-strip';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
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

      <Button label="Continue" onPress={onNext} disabled={!value} style={styles.button} />
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
  button: {
    marginTop: Spacing.four,
  },
});
