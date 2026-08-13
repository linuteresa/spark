import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import { ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';

import { SignInScreen } from '@/components/sign-in-screen';
import { ThemedView } from '@/components/themed-view';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!session) {
    return <SignInScreen />;
  }

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
