import { useRouter } from 'expo-router';
import { Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import { EmotionCharacter } from '@/components/emotions/emotion-character';
import { ThemedText } from '@/components/themed-text';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import type { Emotion } from '@/lib/types';

interface HeaderBannerProps {
  emotion: Emotion | null;
  streakDays: number;
}

export function HeaderBanner({ emotion, streakDays }: HeaderBannerProps) {
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: HomeTheme.card }]}>
      <View style={styles.row}>
        <View style={styles.moodBlock}>
          {emotion ? (
            <>
              <EmotionCharacter emotion={emotion} size={56} />
              <Image
                source={require('@/assets/images/home/character-shadow.png')}
                style={styles.shadow}
                resizeMode="contain"
              />
            </>
          ) : null}
          <ThemedText type="small" themeColor="textSecondary">
            {emotion ? 'Today' : 'No check-in yet'}
          </ThemedText>
        </View>
        <View style={[styles.streakPill, { backgroundColor: HomeTheme.accentSoft }]}>
          <ThemedText type="smallBold" style={{ color: HomeTheme.accent }}>
            🔥 {streakDays} Days
          </ThemedText>
        </View>
      </View>

      <ImageBackground
        source={require('@/assets/images/home/recharge-illustration.png')}
        style={styles.rechargeBanner}
        imageStyle={styles.rechargeBannerImage}>
        <Pressable onPress={() => router.push('/(tabs)/recharge')}>
          <Image
            source={require('@/assets/images/home/recharge-button.png')}
            style={styles.rechargeButton}
            resizeMode="contain"
          />
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodBlock: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  shadow: {
    width: 40,
    height: 4,
    marginTop: -4,
  },
  streakPill: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
  rechargeBanner: {
    height: 100,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  rechargeBannerImage: {
    borderRadius: Spacing.three,
  },
  rechargeButton: {
    width: 180,
    height: 51,
  },
});
