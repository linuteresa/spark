import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';

const DAILY_GOAL = 50;

interface PointsCardProps {
  pointsToday: number;
}

export function PointsCard({ pointsToday }: PointsCardProps) {
  const progress = Math.min(pointsToday / DAILY_GOAL, 1);

  return (
    <View style={[styles.container, { backgroundColor: HomeTheme.card }]}>
      <ThemedText type="smallBold">Today's Spark</ThemedText>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: HomeTheme.accent }]} />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {pointsToday}/{DAILY_GOAL} XP
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5EAF3',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
