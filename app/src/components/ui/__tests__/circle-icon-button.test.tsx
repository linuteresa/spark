import { fireEvent, render, screen } from '@testing-library/react-native';

import { CircleArrowButton } from '@/components/ui/circle-icon-button';

describe('CircleArrowButton', () => {
  it('fires onPress when enabled', () => {
    const onPress = jest.fn();
    render(<CircleArrowButton onPress={onPress} testID="arrow" />);
    fireEvent.press(screen.getByTestId('arrow'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    render(<CircleArrowButton onPress={onPress} disabled testID="arrow" />);
    fireEvent.press(screen.getByTestId('arrow'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
