import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeekStrip() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <View style={styles.row}>
      {days.map((date, i) => {
        const isToday = date.toDateString() === today.toDateString();
        return (
          <View key={i} style={[styles.day, isToday && styles.today]}>
            <ThemedText type="small" themeColor={isToday ? 'background' : 'textSecondary'}>
              {DAY_LABELS[i]}
            </ThemedText>
            <ThemedText type="smallBold" themeColor={isToday ? 'background' : 'text'}>
              {date.getDate()}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    alignItems: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    borderRadius: Spacing.three,
    minWidth: 36,
  },
  today: {
    backgroundColor: '#5B8DEF',
  },
});
