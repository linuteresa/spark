import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { HomeTheme } from '@/constants/palette';

interface WaveBackgroundProps {
  style?: StyleProp<ViewStyle>;
}

export function WaveBackground({ style }: WaveBackgroundProps) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="none" style={style}>
      <Path
        d="M0 90 C 70 40, 140 130, 210 80 C 280 30, 340 100, 400 60 L 400 260 L 0 260 Z"
        fill={HomeTheme.background}
      />
      <Path
        d="M0 140 C 80 100, 150 180, 230 130 C 300 90, 350 150, 400 120 L 400 260 L 0 260 Z"
        fill={HomeTheme.accentSoft}
      />
      <Path
        d="M0 190 C 90 160, 160 220, 240 180 C 310 150, 360 200, 400 175 L 400 260 L 0 260 Z"
        fill={HomeTheme.accent}
        opacity={0.9}
      />
    </Svg>
  );
}
