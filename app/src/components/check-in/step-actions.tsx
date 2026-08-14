import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';

interface StepActionsProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
}

export function StepActions({ onBack, onNext, nextLabel = 'Continue', nextDisabled, nextLoading }: StepActionsProps) {
  return (
    <View style={styles.actions}>
      <Button label="Back" onPress={onBack} variant="outline" style={styles.flexButton} />
      <Button
        label={nextLabel}
        onPress={onNext}
        disabled={nextDisabled}
        loading={nextLoading}
        style={styles.flexButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  flexButton: {
    flex: 1,
  },
});
