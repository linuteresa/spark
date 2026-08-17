import { useRef, useState } from 'react';
import { Image, PanResponder, Pressable, StyleSheet, View } from 'react-native';

import { EmotionCharacter } from '@/components/emotions/emotion-character';
import { ThemedText } from '@/components/themed-text';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { EMOTIONS, type Emotion } from '@/lib/types';

const WHEEL_WIDTH = 320;
const WHEEL_HEIGHT = WHEEL_WIDTH * (233 / 453);
const RADIUS = WHEEL_WIDTH / 2;
const ICON_ARC_RADIUS = RADIUS * 0.82;
const ICON_SIZE = 48;
const ICON_SIZE_SELECTED = 56;
const KNOB_SIZE = 28;

export function angleForIndex(index: number, total: number) {
  return 180 - (index + 0.5) * (180 / total);
}

export function indexForAngle(angleDeg: number, total: number) {
  const clamped = Math.max(0, Math.min(180, angleDeg));
  const index = Math.floor((180 - clamped) / (180 / total));
  return Math.max(0, Math.min(total - 1, index));
}

function positionFor(angleDeg: number, radius: number, size: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = RADIUS + radius * Math.cos(angleRad);
  const y = RADIUS - radius * Math.sin(angleRad);
  return { left: x - size / 2, top: y - size / 2 };
}

interface EmotionWheelProps {
  value: Emotion | null;
  onChange: (emotion: Emotion) => void;
}

export function EmotionWheel({ value, onChange }: EmotionWheelProps) {
  const containerRef = useRef<View>(null);
  const originRef = useRef({ x: 0, y: 0 });
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [dragging, setDragging] = useState(false);

  const selectedIndex = value ? EMOTIONS.findIndex((e) => e.value === value) : -1;
  const selected = selectedIndex >= 0 ? EMOTIONS[selectedIndex] : undefined;
  const knobAngle = selectedIndex >= 0 ? angleForIndex(selectedIndex, EMOTIONS.length) : 90;

  function selectFromPoint(x: number, y: number) {
    const dx = x - originRef.current.x - RADIUS;
    const dy = y - originRef.current.y - RADIUS;
    const angleDeg = (Math.atan2(-dy, dx) * 180) / Math.PI;
    const index = indexForAngle(angleDeg, EMOTIONS.length);
    onChangeRef.current(EMOTIONS[index].value);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_evt, gesture) => {
        setDragging(true);
        selectFromPoint(gesture.x0, gesture.y0);
      },
      onPanResponderMove: (_evt, gesture) => {
        selectFromPoint(gesture.moveX, gesture.moveY);
      },
      onPanResponderRelease: () => setDragging(false),
      onPanResponderTerminate: () => setDragging(false),
    })
  ).current;

  function handleLayout() {
    containerRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
      originRef.current = { x: pageX, y: pageY };
    });
  }

  return (
    <View style={styles.container}>
      <View
        ref={containerRef}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
        style={[styles.wheelWrap, { width: WHEEL_WIDTH, height: WHEEL_HEIGHT }]}>
        <Image
          source={require('@/assets/images/emotions/wheel.png')}
          style={{ width: WHEEL_WIDTH, height: WHEEL_HEIGHT }}
          resizeMode="contain"
        />
        {EMOTIONS.map((e, i) => {
          const angleDeg = angleForIndex(i, EMOTIONS.length);
          const isSelected = value === e.value;
          const size = isSelected ? ICON_SIZE_SELECTED : ICON_SIZE;
          const pos = positionFor(angleDeg, ICON_ARC_RADIUS, size);
          return (
            <Pressable key={e.value} onPress={() => onChange(e.value)} style={[styles.iconSlot, pos]} hitSlop={8}>
              <EmotionCharacter emotion={e.value} size={size} />
            </Pressable>
          );
        })}

        {value && (
          <View
            pointerEvents="none"
            style={[
              styles.knob,
              positionFor(knobAngle, ICON_ARC_RADIUS, KNOB_SIZE),
              { borderColor: HomeTheme.accent },
              dragging && styles.knobActive,
            ]}
          />
        )}
      </View>

      <View style={styles.centerCharacter}>
        {selected ? (
          <>
            <EmotionCharacter emotion={selected.value} size={96} />
            <View style={[styles.labelPill, { borderColor: HomeTheme.accent }]}>
              <ThemedText type="smallBold">{selected.label}</ThemedText>
            </View>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Tap or drag to pick how you feel
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
  knob: {
    position: 'absolute',
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
  },
  knobActive: {
    transform: [{ scale: 1.15 }],
  },
  centerCharacter: {
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    gap: 4,
  },
  labelPill: {
    marginTop: 4,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.five,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
});
