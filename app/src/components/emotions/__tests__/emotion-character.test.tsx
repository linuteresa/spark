import { render } from '@testing-library/react-native';

import { EmotionCharacter } from '@/components/emotions/emotion-character';
import { EMOTIONS } from '@/lib/types';

describe('EmotionCharacter', () => {
  it.each(EMOTIONS.map((e) => e.value))('renders the artwork for emotion=%s without crashing', (emotion) => {
    const result = render(<EmotionCharacter emotion={emotion} />);
    expect(result.toJSON()).toBeTruthy();
  });

  it('applies a custom size', () => {
    const result = render(<EmotionCharacter emotion="happy" size={40} />);
    const image = result.toJSON();
    expect(image).toMatchObject({ props: expect.objectContaining({ style: expect.objectContaining({ width: 40, height: 40 }) }) });
  });
});
