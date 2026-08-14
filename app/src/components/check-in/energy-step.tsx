import { StyleSheet, View } from 'react-native';

import { SelectableOption } from '@/components/check-in/selectable-option';
import { StepActions } from '@/components/check-in/step-actions';
import { ThemedText } from '@/components/themed-text';
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
        <SelectableOption
          key={level.value}
          label={`${level.label} Energy`}
          description={DESCRIPTIONS[level.value]}
          selected={value === level.value}
          onPress={() => onChange(level.value)}
        />
      ))}

      <StepActions onBack={onBack} onNext={onNext} nextDisabled={!value} />
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
});
