import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Card } from '@/components/ui/card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <Text>Inside card</Text>
      </Card>
    );
    expect(screen.getByText('Inside card')).toBeTruthy();
  });

  it('applies a custom backgroundColor prop', () => {
    render(
      <Card backgroundColor="#123456" testID="card">
        <Text>content</Text>
      </Card>
    );
    const card = screen.getByTestId('card');
    const flatStyle = Array.isArray(card.props.style) ? Object.assign({}, ...card.props.style) : card.props.style;
    expect(flatStyle.backgroundColor).toBe('#123456');
  });
});
