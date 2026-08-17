import { fireEvent, render, screen } from '@testing-library/react-native';

import { CheckInPrompt } from '@/components/home/check-in-prompt';

describe('CheckInPrompt', () => {
  it('renders nothing visible when not visible', () => {
    render(<CheckInPrompt visible={false} onCheckIn={() => {}} onDismiss={() => {}} />);
    expect(screen.queryByText('Check in now')).toBeNull();
  });

  it('fires onCheckIn and onDismiss when visible', () => {
    const onCheckIn = jest.fn();
    const onDismiss = jest.fn();
    render(<CheckInPrompt visible onCheckIn={onCheckIn} onDismiss={onDismiss} />);

    fireEvent.press(screen.getByText('Check in now'));
    expect(onCheckIn).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText('Not now'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
