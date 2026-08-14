import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface CircleArrowButtonProps {
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  size?: number;
}

export function CircleArrowButton({ onPress, disabled, color = '#5B8DEF', size = 56 }: CircleArrowButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24">
        <Path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="#FFFFFF"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
});
