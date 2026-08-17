import { fireEvent, render, screen } from '@testing-library/react-native';

import { HeaderBanner } from '@/components/home/header-banner';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('HeaderBanner', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('shows the streak count and avatar initial', () => {
    render(<HeaderBanner emotion={null} streakDays={5} avatarLabel="Terp" />);
    expect(screen.getByText('🔥 5 Days')).toBeTruthy();
    expect(screen.getByText('T')).toBeTruthy();
  });

  it('shows the emotion label and character only when an emotion is set', () => {
    const { rerender } = render(<HeaderBanner emotion={null} streakDays={0} avatarLabel="Terp" />);
    expect(screen.queryByText('Happy')).toBeNull();

    rerender(<HeaderBanner emotion="happy" streakDays={0} avatarLabel="Terp" />);
    expect(screen.getByText('Happy')).toBeTruthy();
  });

  it('navigates to the recharge tab when the recharge button is pressed', () => {
    render(<HeaderBanner emotion={null} streakDays={0} avatarLabel="Terp" />);
    fireEvent.press(screen.getByTestId('recharge-button'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/recharge');
  });
});
