import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { ENERGY_LEVELS, type EnergyLevel } from '@/lib/types';

const DESCRIPTIONS: Record<EnergyLevel, string> = {
  1: 'Solo, low-friction micro-actions.',
  2: 'Asynchronous steps to build momentum.',
  3: 'Real-world outreach or group participation.',
};

interface EnergyStepProps {
  value: EnergyLevel | null;
  onChange: (level: EnergyLevel) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EnergyStep({ value, onChange, onNext, onBack }: EnergyStepProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.heading}>
        What's your energy level right now?
      </ThemedText>

      {ENERGY_LEVELS.map((level) => (
        <Pressable
          key={level.value}
          onPress={() => onChange(level.value)}
          style={[styles.card, value === level.value ? styles.cardSelected : styles.cardIdle]}>
          <ThemedText type="smallBold">{level.label} Energy</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {DESCRIPTIONS[level.value]}
          </ThemedText>
        </Pressable>
      ))}

      <View style={styles.actions}>
        <Button label="Back" onPress={onBack} variant="outline" style={styles.flexButton} />
        <Button label="Continue" onPress={onNext} disabled={!value} style={styles.flexButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  heading: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.half,
    borderWidth: 2,
  },
  cardIdle: {
    backgroundColor: '#F5F6F8',
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: '#EAF1FE',
    borderColor: '#5B8DEF',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  flexButton: {
    flex: 1,
  },
});
