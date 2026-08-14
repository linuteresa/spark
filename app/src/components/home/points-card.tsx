import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';

const DAILY_GOAL = 50;
const CAP_SIZE = 22;

interface PointsCardProps {
  pointsToday: number;
}

export function PointsCard({ pointsToday }: PointsCardProps) {
  const progress = Math.min(pointsToday / DAILY_GOAL, 1);

  return (
    <View style={[styles.container, { backgroundColor: HomeTheme.card }]}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold">Today's Spark</ThemedText>
        <View style={styles.xpRow}>
          <Image source={require('@/assets/images/home/task-spark-icon.png')} style={styles.xpIcon} resizeMode="contain" />
          <ThemedText type="small" themeColor="textSecondary">
            {pointsToday}/{DAILY_GOAL}XP
          </ThemedText>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: HomeTheme.accent }]} />
        <Image
          source={require('@/assets/images/home/points-bar-start-cap.png')}
          style={[styles.cap, { left: -CAP_SIZE / 2 }]}
          resizeMode="contain"
        />
        <Image
          source={require('@/assets/images/home/points-bar-end-cap.png')}
          style={[styles.cap, { left: `${progress * 100}%`, marginLeft: -CAP_SIZE / 2 }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  xpIcon: {
    width: 14,
    height: 14,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5EAF3',
    overflow: 'visible',
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  cap: {
    position: 'absolute',
    width: CAP_SIZE,
    height: CAP_SIZE,
  },
});
