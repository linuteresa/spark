import { Pressable, StyleSheet, View } from 'react-native';

import { EmotionCharacter } from '@/components/emotions/emotion-character';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { WeekStrip } from '@/components/check-in/week-strip';
import { Spacing } from '@/constants/theme';
import { EMOTIONS, type Emotion } from '@/lib/types';

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

      <View style={styles.grid}>
        {EMOTIONS.map((e) => (
          <Pressable
            key={e.value}
            onPress={() => onChange(e.value)}
            style={[styles.emotionCell, value === e.value && styles.emotionCellSelected]}>
            <EmotionCharacter emotion={e.value} size={value === e.value ? 64 : 52} />
            <ThemedText type="small">{e.label}</ThemedText>
          </Pressable>
        ))}
      </View>

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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  emotionCell: {
    alignItems: 'center',
    gap: Spacing.one,
    width: 90,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  emotionCellSelected: {
    backgroundColor: '#EAF1FE',
  },
  button: {
    marginTop: Spacing.four,
  },
});
