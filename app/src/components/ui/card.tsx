import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';

interface CardProps extends ViewProps {
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({ backgroundColor = '#FFFFFF', style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, { backgroundColor }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
