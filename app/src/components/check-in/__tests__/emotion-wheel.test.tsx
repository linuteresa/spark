import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmotionWheel } from '@/components/check-in/emotion-wheel';
import { EMOTIONS } from '@/lib/types';

describe('EmotionWheel', () => {
  it('shows the placeholder prompt when nothing is selected', () => {
    render(<EmotionWheel value={null} onChange={() => {}} />);
    expect(screen.getByText('Tap or drag to pick how you feel')).toBeTruthy();
  });

  it('shows the selected emotion label instead of the placeholder', () => {
    render(<EmotionWheel value="happy" onChange={() => {}} />);
    expect(screen.queryByText('Tap or drag to pick how you feel')).toBeNull();
    expect(screen.getByText('Happy')).toBeTruthy();
  });

  it.each(EMOTIONS.map((e) => [e.value, e.label] as const))(
    'tapping the %s icon calls onChange with %s',
    (value) => {
      const onChange = jest.fn();
      render(<EmotionWheel value={null} onChange={onChange} />);
      fireEvent.press(screen.getByTestId(`emotion-icon-${value}`));
      expect(onChange).toHaveBeenCalledWith(value);
    }
  );
});
