import Svg, { Path, Polygon } from 'react-native-svg';

import { EmotionColors } from '@/constants/palette';
import type { Emotion } from '@/lib/types';

interface ShapeSpec {
  points: number;
  innerRadiusRatio: number;
  face: 'worried' | 'downturned' | 'flat' | 'jagged' | 'neutral' | 'smiling';
}

const SHAPES: Record<Emotion, ShapeSpec> = {
  anxious: { points: 7, innerRadiusRatio: 0.35, face: 'worried' },
  sad: { points: 6, innerRadiusRatio: 0.6, face: 'downturned' },
  foggy: { points: 5, innerRadiusRatio: 0.3, face: 'flat' },
  restless: { points: 8, innerRadiusRatio: 0.45, face: 'jagged' },
  okay: { points: 4, innerRadiusRatio: 0.4, face: 'neutral' },
  happy: { points: 5, innerRadiusRatio: 0.55, face: 'smiling' },
};

function starPoints(size: number, points: number, innerRadiusRatio: number): string {
  const center = size / 2;
  const outerRadius = size / 2 - 2;
  const innerRadius = outerRadius * innerRadiusRatio;
  const totalPoints = points * 2;
  const coords: string[] = [];

  for (let i = 0; i < totalPoints; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    coords.push(`${x},${y}`);
  }

  return coords.join(' ');
}

function facePath(size: number, face: ShapeSpec['face']): string {
  const cx = size / 2;
  const cy = size / 2;
  const eyeOffsetX = size * 0.1;
  const eyeY = cy - size * 0.03;
  const mouthY = cy + size * 0.1;
  const mouthWidth = size * 0.12;

  const eyes = `M ${cx - eyeOffsetX - 3} ${eyeY} q 3 -4 6 0 M ${cx + eyeOffsetX - 3} ${eyeY} q 3 -4 6 0`;

  switch (face) {
    case 'smiling':
      return `${eyes} M ${cx - mouthWidth} ${mouthY} Q ${cx} ${mouthY + size * 0.08} ${cx + mouthWidth} ${mouthY}`;
    case 'downturned':
      return `${eyes} M ${cx - mouthWidth} ${mouthY + size * 0.05} Q ${cx} ${mouthY - size * 0.03} ${cx + mouthWidth} ${mouthY + size * 0.05}`;
    case 'worried':
      return `${eyes} M ${cx - mouthWidth} ${mouthY} q ${mouthWidth * 0.5} ${size * 0.05} ${mouthWidth} 0 q ${mouthWidth * 0.5} -${size * 0.05} ${mouthWidth} 0`;
    case 'jagged':
      return `${eyes} M ${cx - mouthWidth} ${mouthY} l ${mouthWidth * 0.5} ${size * 0.05} l ${mouthWidth * 0.5} -${size * 0.05} l ${mouthWidth * 0.5} ${size * 0.05}`;
    case 'flat':
    case 'neutral':
    default:
      return `${eyes} M ${cx - mouthWidth} ${mouthY} L ${cx + mouthWidth} ${mouthY}`;
  }
}

interface EmotionCharacterProps {
  emotion: Emotion;
  size?: number;
}

export function EmotionCharacter({ emotion, size = 72 }: EmotionCharacterProps) {
  const shape = SHAPES[emotion];
  const color = EmotionColors[emotion];

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Polygon
        points={starPoints(size, shape.points, shape.innerRadiusRatio)}
        fill={color}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d={facePath(size, shape.face)} stroke="#2A2A2A" strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
