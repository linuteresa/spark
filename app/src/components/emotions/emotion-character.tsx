import { Image, type ImageSourcePropType } from 'react-native';

import type { Emotion } from '@/lib/types';

const CHARACTERS: Record<Emotion, ImageSourcePropType> = {
  anxious: require('@/assets/images/emotions/anxious.png'),
  sad: require('@/assets/images/emotions/sad.png'),
  foggy: require('@/assets/images/emotions/foggy.png'),
  restless: require('@/assets/images/emotions/restless.png'),
  okay: require('@/assets/images/emotions/okay.png'),
  happy: require('@/assets/images/emotions/happy.png'),
};

interface EmotionCharacterProps {
  emotion: Emotion;
  size?: number;
}

export function EmotionCharacter({ emotion, size = 72 }: EmotionCharacterProps) {
  return (
    <Image source={CHARACTERS[emotion]} style={{ width: size, height: size }} resizeMode="contain" />
  );
}
