import { Image, Pressable, StyleSheet, View } from 'react-native';

import { EmotionCharacter } from '@/components/emotions/emotion-character';
import { ThemedText } from '@/components/themed-text';
import { EMOTIONS, type Emotion } from '@/lib/types';

const WHEEL_WIDTH = 320;
const WHEEL_HEIGHT = WHEEL_WIDTH * (233 / 453);
const RADIUS = WHEEL_WIDTH / 2;
const ICON_ARC_RADIUS = RADIUS * 0.78;
const ICON_SIZE = 40;
const ICON_SIZE_SELECTED = 48;

function positionFor(index: number, total: number) {
  const angleDeg = 180 - (index + 0.5) * (180 / total);
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = RADIUS + ICON_ARC_RADIUS * Math.cos(angleRad);
  const y = RADIUS - ICON_ARC_RADIUS * Math.sin(angleRad);
  return { left: x - ICON_SIZE_SELECTED / 2, top: y - ICON_SIZE_SELECTED / 2 };
}

interface EmotionWheelProps {
  value: Emotion | null;
  onChange: (emotion: Emotion) => void;
}

export function EmotionWheel({ value, onChange }: EmotionWheelProps) {
  const selected = EMOTIONS.find((e) => e.value === value);

  return (
    <View style={styles.container}>
      <View style={[styles.wheelWrap, { width: WHEEL_WIDTH, height: WHEEL_HEIGHT }]}>
        <Image
          source={require('@/assets/images/emotions/wheel.png')}
          style={{ width: WHEEL_WIDTH, height: WHEEL_HEIGHT }}
          resizeMode="contain"
        />
        {EMOTIONS.map((e, i) => {
          const pos = positionFor(i, EMOTIONS.length);
          const isSelected = value === e.value;
          return (
            <Pressable
              key={e.value}
              onPress={() => onChange(e.value)}
              style={[styles.iconSlot, pos]}
              hitSlop={8}>
              <EmotionCharacter emotion={e.value} size={isSelected ? ICON_SIZE_SELECTED : ICON_SIZE} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.centerCharacter}>
        {selected ? (
          <>
            <EmotionCharacter emotion={selected.value} size={96} />
            <ThemedText type="smallBold" style={styles.centerLabel}>
              {selected.label}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Tap a character above
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  wheelWrap: {
    position: 'relative',
  },
  iconSlot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCharacter: {
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    gap: 4,
  },
  centerLabel: {
    marginTop: 4,
  },
});
