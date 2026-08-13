import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { RechargeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';

interface MovePrompt {
  id: string;
  label: string;
  seconds: number;
}

const PROMPTS: MovePrompt[] = [
  { id: 'stretch', label: 'Stand and stretch your arms overhead', seconds: 60 },
  { id: 'shoulders', label: 'Roll your shoulders and neck slowly', seconds: 45 },
  { id: 'walk', label: 'Walk to the nearest window and back', seconds: 90 },
  { id: 'shake', label: 'Shake out your hands and legs', seconds: 30 },
];

function CountdownTimer({ prompt, onExit }: { prompt: MovePrompt; onExit: () => void }) {
  const [remaining, setRemaining] = useState(prompt.seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return (
    <View style={styles.timerContainer}>
      <ThemedText type="title">{remaining}s</ThemedText>
      <ThemedText type="default" style={styles.timerLabel}>
        {prompt.label}
      </ThemedText>
      <Button label={remaining === 0 ? 'Done' : 'Stop'} onPress={onExit} color={RechargeTheme.accent} />
    </View>
  );
}

export function MoveTab() {
  const [active, setActive] = useState<MovePrompt | null>(null);

  if (active) {
    return <CountdownTimer prompt={active} onExit={() => setActive(null)} />;
  }

  return (
    <View style={styles.list}>
      {PROMPTS.map((prompt) => (
        <Pressable
          key={prompt.id}
          onPress={() => setActive(prompt)}
          style={[styles.card, { backgroundColor: RechargeTheme.card }]}>
          <ThemedText type="smallBold">{prompt.label}</ThemedText>
          <ThemedText type="small" style={{ color: RechargeTheme.textSecondary }}>
            {prompt.seconds}s
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.six,
  },
  timerLabel: {
    textAlign: 'center',
  },
});
