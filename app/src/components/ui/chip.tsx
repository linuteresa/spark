import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, selected, onPress, color = '#5B8DEF', style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: color },
        selected ? { backgroundColor: color } : styles.unselected,
        style,
      ]}>
      <ThemedText type="smallBold" style={selected ? styles.selectedLabel : { color }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 2,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  unselected: {
    backgroundColor: 'transparent',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});
