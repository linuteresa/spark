import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ScreenContainer } from '@/components/ui/screen-container';

describe('ScreenContainer', () => {
  it('renders children inside a scroll view by default', () => {
    render(
      <ScreenContainer>
        <Text>scrollable content</Text>
      </ScreenContainer>
    );
    expect(screen.getByText('scrollable content')).toBeTruthy();
  });

  it('renders children in a plain view when scroll is false', () => {
    render(
      <ScreenContainer scroll={false}>
        <Text>static content</Text>
      </ScreenContainer>
    );
    expect(screen.getByText('static content')).toBeTruthy();
  });
});
