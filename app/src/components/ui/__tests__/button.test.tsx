import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '../button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button label="Check in" onPress={() => {}} />);
    expect(screen.getByText('Check in')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Button label="Check in" onPress={onPress} />);
    fireEvent.press(screen.getByText('Check in'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button label="Check in" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Check in'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress while loading', () => {
    const onPress = jest.fn();
    render(<Button label="Check in" onPress={onPress} loading />);
    // The label is replaced by a spinner while loading, so it should not
    // even be on screen to tap.
    expect(screen.queryByText('Check in')).toBeNull();
  });
});
