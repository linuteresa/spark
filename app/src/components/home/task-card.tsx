import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import type { ChallengeAssignment } from '@/lib/types';

interface TaskCardProps {
  assignment: ChallengeAssignment | null;
  onComplete: () => void;
  completing: boolean;
}

export function TaskCard({ assignment, onComplete, completing }: TaskCardProps) {
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

  return (
    <View style={[styles.container, { backgroundColor: HomeTheme.card }]}>
      <ThemedText type="smallBold">
        {isDone ? 'Today\'s task, done!' : "Let's finish your task!"}
      </ThemedText>
      <ThemedText type="default">{assignment.action_matrix.action_text}</ThemedText>
      {!isDone && (
        <Button label="Mark complete" onPress={onComplete} loading={completing} color={HomeTheme.accent} />
      )}
      {isDone && <ThemedText style={styles.done}>✅ Nice work</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  done: {
    color: '#1a7f37',
  },
});
