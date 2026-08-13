import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { PointsLedgerEntry } from '@/lib/types';

function startOfWeek(): Date {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
}

const SOURCE_LABELS: Record<string, string> = {
  daily_check_in: 'Daily check-in',
  challenge_completion: 'Task completed',
};

interface PointsBreakdownProps {
  ledger: PointsLedgerEntry[];
}

export function PointsBreakdown({ ledger }: PointsBreakdownProps) {
  const weekStart = startOfWeek();
  const weekly = ledger.filter((row) => new Date(row.created_at) >= weekStart);
  const weeklyTotal = weekly.reduce((sum, row) => sum + row.amount, 0);
  const allTimeTotal = ledger.reduce((sum, row) => sum + row.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <ThemedText type="title">{weeklyTotal}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            This week
          </ThemedText>
        </View>
        <View style={styles.summaryCard}>
          <ThemedText type="title">{allTimeTotal}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            All time
          </ThemedText>
        </View>
      </View>

      <ThemedText type="smallBold" style={styles.historyHeading}>
        History
      </ThemedText>
      {ledger.slice(0, 20).map((row) => (
        <View key={row.id} style={styles.historyRow}>
          <ThemedText type="small">{SOURCE_LABELS[row.source] ?? row.source}</ThemedText>
          <ThemedText type="smallBold">+{row.amount}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    borderRadius: Spacing.four,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  historyHeading: {
    marginTop: Spacing.two,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
});
