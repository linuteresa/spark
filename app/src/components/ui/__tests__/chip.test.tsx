import { fireEvent, render, screen } from '@testing-library/react-native';

import { Chip } from '@/components/ui/chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip label="Club" selected={false} onPress={() => {}} />);
    expect(screen.getByText('Club')).toBeTruthy();
  });

  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Chip label="Student" selected={false} onPress={onPress} />);
    fireEvent.press(screen.getByText('Student'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders selected and unselected visual states without crashing', () => {
    const { rerender } = render(<Chip label="Toggle" selected={false} onPress={() => {}} />);
    expect(screen.getByText('Toggle')).toBeTruthy();
    rerender(<Chip label="Toggle" selected onPress={() => {}} />);
    expect(screen.getByText('Toggle')).toBeTruthy();
  });
});
