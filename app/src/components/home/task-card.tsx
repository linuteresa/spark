import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { PILLARS, type ChallengeAssignment, type CheckIn } from '@/lib/types';

interface TaskCardProps {
  assignment: ChallengeAssignment | null;
  checkIn: CheckIn | null;
  onComplete: () => void;
  completing: boolean;
}

export function TaskCard({ assignment, checkIn, onComplete, completing }: TaskCardProps) {
  if (!assignment || !assignment.action_matrix) {
    return (
      <View style={[styles.container, { backgroundColor: HomeTheme.card }]}>
        <ThemedText type="smallBold">No task yet</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Check in to get today's task.
        </ThemedText>
      </View>
    );
  }

  const isDone = !!assignment.completed_at;
  const pillar = checkIn ? PILLARS.find((p) => p.value === checkIn.pillar) : undefined;

  return (
    <View style={[styles.container, { backgroundColor: HomeTheme.card }]}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold">{isDone ? "Today's task, done!" : "Let's finish your task!"}</ThemedText>
        <Pressable onPress={onComplete} disabled={isDone || completing} hitSlop={8}>
          <Image
            source={
              isDone
                ? require('@/assets/images/home/checkbox-complete.png')
                : require('@/assets/images/home/checkbox-incomplete.png')
            }
            style={styles.checkbox}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {pillar && (
        <View style={styles.tagWrap}>
          <Image
            source={require('@/assets/images/home/tag-background.png')}
            style={StyleSheet.absoluteFill}
            resizeMode="stretch"
          />
          <ThemedText type="small" style={styles.tagText}>
            {pillar.label}
          </ThemedText>
        </View>
      )}

      {assignment.ai_note && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.aiNote}>
          {assignment.ai_note}
        </ThemedText>
      )}
      <ThemedText type="default">{assignment.action_matrix.action_text}</ThemedText>
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
  checkbox: {
    width: 27,
    height: 27,
  },
  tagWrap: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.five,
    overflow: 'hidden',
  },
  tagText: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    color: HomeTheme.accent,
  },
  aiNote: {
    fontStyle: 'italic',
  },
});
