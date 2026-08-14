import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface AvatarProps {
  label: string;
  color: string;
  size?: number;
}

export function Avatar({ label, color, size = 40 }: AvatarProps) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <ThemedText type="smallBold" style={styles.label}>
        {label.slice(0, 1).toUpperCase()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
  },
});
