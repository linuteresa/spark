import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmotionCharacter } from '@/components/emotions/emotion-character';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
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
          {emotion ? <EmotionCharacter emotion={emotion} size={56} /> : null}
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

      <Button
        label="Let's Recharge!"
        onPress={() => router.push('/(tabs)/recharge')}
        color={HomeTheme.accent}
        style={styles.button}
      />
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
  streakPill: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
  button: {
    alignSelf: 'stretch',
  },
});
