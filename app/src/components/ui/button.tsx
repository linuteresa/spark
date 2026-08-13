import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = 'solid',
  color = '#5B8DEF',
  style,
}: ButtonProps) {
  const isSolid = variant === 'solid';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isSolid ? { backgroundColor: color } : { borderColor: color, borderWidth: 2 },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isSolid ? '#FFFFFF' : color} />
      ) : (
        <ThemedText type="smallBold" style={isSolid ? styles.solidLabel : { color }}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solidLabel: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
