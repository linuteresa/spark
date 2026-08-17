import { fireEvent, render, screen } from '@testing-library/react-native';

import { GoogleSignInButton } from '@/components/ui/google-sign-in-button';

describe('GoogleSignInButton', () => {
  it('shows the label and fires onPress when idle', () => {
    const onPress = jest.fn();
    render(<GoogleSignInButton onPress={onPress} />);
    fireEvent.press(screen.getByText('Sign in with Google'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner instead of the label while loading', () => {
    render(<GoogleSignInButton onPress={() => {}} loading />);
    expect(screen.queryByText('Sign in with Google')).toBeNull();
  });
});
