import { StyleSheet, View } from 'react-native';

import { SelectableOption } from '@/components/check-in/selectable-option';
import { StepActions } from '@/components/check-in/step-actions';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { PILLARS, type Pillar } from '@/lib/types';

interface PillarStepProps {
  value: Pillar | null;
  onChange: (pillar: Pillar) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PillarStep({ value, onChange, onNext, onBack }: PillarStepProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.heading}>
        Which area feels closest to why you're feeling this way?
      </ThemedText>

      {PILLARS.map((pillar) => (
        <SelectableOption
          key={pillar.value}
          label={pillar.label}
          description={pillar.description}
          selected={value === pillar.value}
          onPress={() => onChange(pillar.value)}
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
