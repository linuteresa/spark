import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
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
        <Pressable
          key={pillar.value}
          onPress={() => onChange(pillar.value)}
          style={[styles.card, value === pillar.value ? styles.cardSelected : styles.cardIdle]}>
          <ThemedText type="smallBold">{pillar.label}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {pillar.description}
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
