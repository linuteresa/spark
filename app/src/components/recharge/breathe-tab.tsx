import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { RechargeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';

interface BreathingPattern {
  id: string;
  label: string;
  description: string;
  phases: { label: string; seconds: number }[];
}

const PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    label: 'Box Breathing',
    description: '4-4-4-4, steady and grounding.',
    phases: [
      { label: 'Breathe in', seconds: 4 },
      { label: 'Hold', seconds: 4 },
      { label: 'Breathe out', seconds: 4 },
      { label: 'Hold', seconds: 4 },
    ],
  },
  {
    id: '4-7-8',
    label: '4-7-8 Relaxation',
    description: 'Slower exhale to calm the body.',
    phases: [
      { label: 'Breathe in', seconds: 4 },
      { label: 'Hold', seconds: 7 },
      { label: 'Breathe out', seconds: 8 },
    ],
  },
  {
    id: 'simple',
    label: 'Simple Deep Breath',
    description: '4-4, easy to repeat anywhere.',
    phases: [
      { label: 'Breathe in', seconds: 4 },
      { label: 'Breathe out', seconds: 4 },
    ],
  },
];

function BreathingVisual({ pattern, onExit }: { pattern: BreathingPattern; onExit: () => void }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    let cancelled = false;

    function runPhase(index: number) {
      if (cancelled) return;
      const phase = pattern.phases[index];
      const growing = phase.label === 'Breathe in';
      const shrinking = phase.label === 'Breathe out';

      if (growing) {
        Animated.timing(scale, {
          toValue: 1,
          duration: phase.seconds * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      } else if (shrinking) {
        Animated.timing(scale, {
          toValue: 0.6,
          duration: phase.seconds * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      }

      setPhaseIndex(index);

      setTimeout(() => {
        if (!cancelled) runPhase((index + 1) % pattern.phases.length);
      }, phase.seconds * 1000);
    }

    runPhase(0);
    return () => {
      cancelled = true;
    };
  }, [pattern, scale]);

  return (
    <View style={styles.visualContainer}>
      <Animated.View
        style={[
          styles.circle,
          { backgroundColor: RechargeTheme.accentSoft, transform: [{ scale }] },
        ]}
      />
      <ThemedText type="subtitle" style={styles.phaseLabel}>
        {pattern.phases[phaseIndex].label}
      </ThemedText>
      <Button label="Done" onPress={onExit} color={RechargeTheme.accent} />
    </View>
  );
}

export function BreatheTab() {
  const [active, setActive] = useState<BreathingPattern | null>(null);

  if (active) {
    return <BreathingVisual pattern={active} onExit={() => setActive(null)} />;
  }

  return (
    <View style={styles.list}>
      {PATTERNS.map((pattern) => (
        <Pressable
          key={pattern.id}
          onPress={() => setActive(pattern)}
          style={[styles.card, { backgroundColor: RechargeTheme.card }]}>
          <ThemedText type="smallBold">{pattern.label}</ThemedText>
          <ThemedText type="small" style={{ color: RechargeTheme.textSecondary }}>
            {pattern.description}
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
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.five,
    paddingVertical: Spacing.six,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  phaseLabel: {
    textAlign: 'center',
  },
});
