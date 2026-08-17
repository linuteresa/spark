import { fireEvent, render, screen } from '@testing-library/react-native';

import { SelectableOption } from '@/components/check-in/selectable-option';

describe('SelectableOption', () => {
  it('renders the label and fires onPress', () => {
    const onPress = jest.fn();
    render(<SelectableOption label="Social" selected={false} onPress={onPress} />);
    fireEvent.press(screen.getByText('Social'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders an optional description when provided', () => {
    render(
      <SelectableOption
        label="Social"
        description="Friends, roommates, belonging, crowds"
        selected
        onPress={() => {}}
      />
    );
    expect(screen.getByText('Friends, roommates, belonging, crowds')).toBeTruthy();
  });

  it('omits the description block when none is given', () => {
    render(<SelectableOption label="Social" selected={false} onPress={() => {}} />);
    expect(screen.queryByText('Friends, roommates, belonging, crowds')).toBeNull();
  });
});
