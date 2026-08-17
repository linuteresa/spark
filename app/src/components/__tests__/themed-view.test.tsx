import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ThemedView } from '@/components/themed-view';

describe('ThemedView', () => {
  it('renders children with a themed background color', () => {
    render(
      <ThemedView testID="themed-view">
        <Text>child</Text>
      </ThemedView>
    );
    const view = screen.getByTestId('themed-view');
    const flatStyle = Array.isArray(view.props.style) ? Object.assign({}, ...view.props.style) : view.props.style;
    expect(flatStyle.backgroundColor).toBe('#ffffff');
    expect(screen.getByText('child')).toBeTruthy();
  });

  it('uses the color for the given theme type', () => {
    render(<ThemedView type="backgroundElement" testID="themed-view" />);
    const view = screen.getByTestId('themed-view');
    const flatStyle = Array.isArray(view.props.style) ? Object.assign({}, ...view.props.style) : view.props.style;
    expect(flatStyle.backgroundColor).toBe('#F0F0F3');
  });
});
