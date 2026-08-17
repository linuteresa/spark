import { act, fireEvent, render, screen } from '@testing-library/react-native';

import * as mockAuthContext from '@/test-utils/auth-mock';

import { SignInScreen } from '@/components/sign-in-screen';

jest.mock('@/lib/auth-context', () => mockAuthContext);

const { mockAuthState, resetMockAuthState, setMockAuthState } = mockAuthContext;

describe('SignInScreen', () => {
  beforeEach(() => {
    resetMockAuthState();
  });

  it('shows the hero and a Get Started entry point first', () => {
    render(<SignInScreen />);
    expect(screen.getByText('SPARK')).toBeTruthy();
    expect(screen.queryByText('Sign in with Google')).toBeNull();
  });

  it('reveals the Google sign-in button after Get Started is tapped', () => {
    render(<SignInScreen />);
    fireEvent.press(screen.getByTestId('get-started-button'));
    expect(screen.getByText('Sign in with Google')).toBeTruthy();
  });

  it('calls signInWithGoogle when the Google button is tapped', async () => {
    render(<SignInScreen />);
    fireEvent.press(screen.getByTestId('get-started-button'));

    await act(async () => {
      fireEvent.press(screen.getByText('Sign in with Google'));
    });

    expect(mockAuthState.signInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('shows an auth error message when present', () => {
    setMockAuthState({ error: 'Unsupported email domain for x@example.com.' });
    render(<SignInScreen />);
    fireEvent.press(screen.getByTestId('get-started-button'));
    expect(screen.getByText('Unsupported email domain for x@example.com.')).toBeTruthy();
  });
});
