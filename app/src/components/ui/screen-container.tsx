import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

interface ScreenContainerProps extends ViewProps {
  backgroundColor?: string;
  scroll?: boolean;
}

export function ScreenContainer({
  backgroundColor = '#FFFFFF',
  scroll = true,
  children,
  style,
  ...rest
}: ScreenContainerProps) {
  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <ScrollView contentContainerStyle={[styles.scrollContent, style]} {...rest}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.flexContent, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  flexContent: {
    flex: 1,
  },
});
