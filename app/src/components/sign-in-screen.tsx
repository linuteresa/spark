import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';

export function SignInScreen() {
  const { signInWithGoogle, error } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handlePress() {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.hero}>
        <Image source={require('@/assets/images/login/spark-logo.png')} style={styles.logo} resizeMode="contain" />
        <ThemedText type="title" style={{ color: HomeTheme.accent }}>
          SPARK
        </ThemedText>
        <ThemedText type="subtitle" style={styles.tagline}>
          One check-in away from a spark
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          Your one-stop shop for a mental reset.
        </ThemedText>
      </View>

      {!showLogin ? (
        <Pressable onPress={() => setShowLogin(true)} style={styles.getStartedButton}>
          <Image
            source={require('@/assets/images/login/get-started-button.png')}
            style={styles.getStartedImage}
            resizeMode="contain"
          />
        </Pressable>
      ) : (
        <View style={styles.loginCard}>
          <ThemedText type="smallBold" style={styles.cardHeading}>
            SPARK LOG-IN
          </ThemedText>
          <Button label="Sign in with Google" onPress={handlePress} loading={submitting} color={HomeTheme.accent} />
          {error && <ThemedText style={styles.error}>{error}</ThemedText>}
        </View>
      )}

      <Image
        source={require('@/assets/images/login/cloud-background.png')}
        style={styles.cloudBackground}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.one,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: Spacing.two,
  },
  tagline: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  subtitle: {
    textAlign: 'center',
  },
  getStartedButton: {
    alignSelf: 'center',
    marginBottom: Spacing.six,
    zIndex: 1,
  },
  getStartedImage: {
    width: 180,
    height: 52,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.six,
    gap: Spacing.two,
    zIndex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeading: {
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  error: {
    color: '#cf222e',
    textAlign: 'center',
  },
  cloudBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 260,
    zIndex: -1,
  },
});
