import { StyleSheet, View } from 'react-native';

import { EmotionCharacter } from '@/components/emotions/emotion-character';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { CheckIn } from '@/lib/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface EmotionHistoryProps {
  checkIns: CheckIn[];
}

export function EmotionHistory({ checkIns }: EmotionHistoryProps) {
  if (checkIns.length === 0) {
    return (
      <ThemedText type="small" themeColor="textSecondary">
        No check-ins yet.
      </ThemedText>
    );
  }

  return (
    <View style={styles.list}>
      {checkIns.map((entry) => (
        <View key={entry.id} style={styles.row}>
          <EmotionCharacter emotion={entry.emotion} size={36} />
          <View>
            <ThemedText type="small">{entry.emotion}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {formatDate(entry.created_at)}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
