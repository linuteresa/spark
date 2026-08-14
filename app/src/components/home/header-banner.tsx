import { useRouter } from 'expo-router';
import { Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import { EmotionCharacter } from '@/components/emotions/emotion-character';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { EMOTIONS, type Emotion } from '@/lib/types';

interface HeaderBannerProps {
  emotion: Emotion | null;
  streakDays: number;
  avatarLabel: string;
}

export function HeaderBanner({ emotion, streakDays, avatarLabel }: HeaderBannerProps) {
  const router = useRouter();
  const emotionLabel = EMOTIONS.find((e) => e.value === emotion)?.label;

  return (
    <ImageBackground
      source={require('@/assets/images/home/recharge-illustration.png')}
      style={styles.container}
      imageStyle={styles.image}>
      <View style={styles.topRow}>
        <Avatar label={avatarLabel} color={HomeTheme.accent} />
        <View style={[styles.streakPill, { backgroundColor: '#FFFFFF' }]}>
          <ThemedText type="smallBold" style={{ color: HomeTheme.accent }}>
            🔥 {streakDays} Days
          </ThemedText>
        </View>
      </View>

      <View style={styles.centerBlock}>
        {emotion && (
          <>
            <EmotionCharacter emotion={emotion} size={110} />
            <Image
              source={require('@/assets/images/home/character-shadow.png')}
              style={styles.shadow}
              resizeMode="contain"
            />
          </>
        )}
      </View>

      {emotionLabel && (
        <View style={styles.emotionPill}>
          <ThemedText type="smallBold">{emotionLabel}</ThemedText>
        </View>
      )}

      <Pressable onPress={() => router.push('/(tabs)/recharge')} style={styles.rechargeButtonWrap}>
        <Image
          source={require('@/assets/images/home/recharge-button.png')}
          style={styles.rechargeButton}
          resizeMode="contain"
        />
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    minHeight: 220,
    overflow: 'hidden',
  },
  image: {
    borderRadius: Spacing.four,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakPill: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    width: 60,
    height: 6,
    marginTop: -6,
  },
  emotionPill: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    marginBottom: -Spacing.four,
    zIndex: 1,
  },
  rechargeButtonWrap: {
    alignSelf: 'center',
    marginTop: Spacing.five,
  },
  rechargeButton: {
    width: 180,
    height: 51,
  },
});
