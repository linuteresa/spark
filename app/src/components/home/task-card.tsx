import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { EMOTIONS, ENERGY_LEVELS, PILLARS, type ChallengeAssignment, type CheckIn } from '@/lib/types';

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tagWrap}>
      <Image
        source={require('@/assets/images/home/tag-background.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="stretch"
      />
      <ThemedText type="small" style={styles.tagText}>
        {label}
      </ThemedText>
    </View>
  );
}

interface TaskCardProps {
  assignment: ChallengeAssignment | null;
  checkIn: CheckIn | null;
  onToggle: () => void;
  completing: boolean;
}

export function TaskCard({ assignment, checkIn, onToggle, completing }: TaskCardProps) {
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
  const emotion = checkIn ? EMOTIONS.find((e) => e.value === checkIn.emotion) : undefined;
  const pillar = checkIn ? PILLARS.find((p) => p.value === checkIn.pillar) : undefined;
  const energy = checkIn ? ENERGY_LEVELS.find((e) => e.value === checkIn.energy_level) : undefined;

  return (
    <View style={[styles.container, { backgroundColor: HomeTheme.card }]}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold">{isDone ? "Today's task, done!" : "Let's finish your task!"}</ThemedText>
        <Pressable onPress={onToggle} disabled={completing} hitSlop={8} testID="task-card-toggle">
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

      {(emotion || pillar || energy) && (
        <View style={styles.tagRow}>
          {emotion && <Tag label={emotion.label} />}
          {pillar && <Tag label={`Pillar: ${pillar.label}`} />}
          {energy && <Tag label={`${energy.label} Energy`} />}
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  tagWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.five,
    overflow: 'hidden',
    flexShrink: 1,
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
