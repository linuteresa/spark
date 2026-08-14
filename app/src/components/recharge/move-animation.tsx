import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { RechargeTheme } from '@/constants/palette';

export type MoveKind = 'stretch' | 'shoulders' | 'walk' | 'shake';

const STAGE_SIZE = 140;

function useLoop(config: Animated.TimingAnimationConfig[]) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence(config.map((c) => Animated.timing(value, c))));
    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

function StretchAnimation() {
  const t = useLoop([
    { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true },
    { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true },
  ]);
  const armY = t.interpolate({ inputRange: [0, 1], outputRange: [30, -50] });
  const bodyStretch = t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <View style={styles.stage}>
      <Animated.View style={[styles.head, { transform: [{ scaleY: bodyStretch }] }]} />
      <View style={styles.torso} />
      <Animated.View style={[styles.hand, styles.handLeft, { transform: [{ translateY: armY }] }]} />
      <Animated.View style={[styles.hand, styles.handRight, { transform: [{ translateY: armY }] }]} />
    </View>
  );
}

function ShouldersAnimation() {
  const t = useLoop([
    { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true },
    { toValue: -1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true },
    { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true },
  ]);
  const rotate = t.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-12deg', '0deg', '12deg'] });

  return (
    <View style={styles.stage}>
      <Animated.View style={[styles.shoulderGroup, { transform: [{ rotate }] }]}>
        <View style={styles.head} />
        <View style={styles.torso} />
        <View style={[styles.hand, styles.handLeft]} />
        <View style={[styles.hand, styles.handRight]} />
      </Animated.View>
    </View>
  );
}

function WalkAnimation() {
  const t = useLoop([
    { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true },
    { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true },
  ]);
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [-32, 32] });
  const bob = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -6, 0] });

  return (
    <View style={styles.stage}>
      <Animated.View style={[styles.walkGroup, { transform: [{ translateX }, { translateY: bob }] }]}>
        <View style={styles.head} />
        <View style={styles.torso} />
        <View style={[styles.hand, styles.handLeft]} />
        <View style={[styles.hand, styles.handRight]} />
      </Animated.View>
    </View>
  );
}

function ShakeAnimation() {
  const t = useLoop([
    { toValue: 1, duration: 90, easing: Easing.linear, useNativeDriver: true },
    { toValue: -1, duration: 90, easing: Easing.linear, useNativeDriver: true },
    { toValue: 1, duration: 90, easing: Easing.linear, useNativeDriver: true },
    { toValue: 0, duration: 90, easing: Easing.linear, useNativeDriver: true },
  ]);
  const shakeX = t.interpolate({ inputRange: [-1, 0, 1], outputRange: [-10, 0, 10] });

  return (
    <View style={styles.stage}>
      <View style={styles.head} />
      <View style={styles.torso} />
      <Animated.View style={[styles.hand, styles.handLeft, { transform: [{ translateX: shakeX }] }]} />
      <Animated.View style={[styles.hand, styles.handRight, { transform: [{ translateX: shakeX }] }]} />
    </View>
  );
}

interface MoveAnimationProps {
  kind: MoveKind;
  size?: number;
}

export function MoveAnimation({ kind, size = STAGE_SIZE }: MoveAnimationProps) {
  return (
    <View style={{ width: size, height: size }}>
      {kind === 'stretch' && <StretchAnimation />}
      {kind === 'shoulders' && <ShouldersAnimation />}
      {kind === 'walk' && <WalkAnimation />}
      {kind === 'shake' && <ShakeAnimation />}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoulderGroup: {
    alignItems: 'center',
  },
  walkGroup: {
    alignItems: 'center',
  },
  head: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: RechargeTheme.accent,
    marginBottom: 4,
  },
  torso: {
    width: 14,
    height: 44,
    borderRadius: 7,
    backgroundColor: RechargeTheme.accent,
  },
  hand: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: RechargeTheme.accentSoft,
    top: 44,
  },
  handLeft: {
    left: '50%',
    marginLeft: -30,
  },
  handRight: {
    left: '50%',
    marginLeft: 16,
  },
});
