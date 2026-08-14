import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface SelectableOptionProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableOption({ label, description, selected, onPress }: SelectableOptionProps) {
  return (
    <Pressable onPress={onPress} style={[styles.option, selected ? styles.optionSelected : styles.optionIdle]}>
      <ThemedText type={description ? 'smallBold' : 'default'}>{label}</ThemedText>
      {description && (
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.half,
    borderWidth: 2,
  },
  optionIdle: {
    backgroundColor: '#F5F6F8',
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#EAF1FE',
    borderColor: '#5B8DEF',
  },
});
