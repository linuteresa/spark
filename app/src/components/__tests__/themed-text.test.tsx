import { render, screen } from '@testing-library/react-native';

import { ThemedText } from '@/components/themed-text';

describe('ThemedText', () => {
  it('renders its text content', () => {
    render(<ThemedText>hello world</ThemedText>);
    expect(screen.getByText('hello world')).toBeTruthy();
  });

  it.each(['default', 'title', 'small', 'smallBold', 'subtitle', 'link', 'linkPrimary', 'code'] as const)(
    'renders without crashing for type=%s',
    (type) => {
      render(<ThemedText type={type}>styled</ThemedText>);
      expect(screen.getByText('styled')).toBeTruthy();
    }
  );

  it('uses the given themeColor', () => {
    render(<ThemedText themeColor="textSecondary">secondary</ThemedText>);
    const node = screen.getByText('secondary');
    const flatStyle = Array.isArray(node.props.style) ? Object.assign({}, ...node.props.style) : node.props.style;
    expect(flatStyle.color).toBe('#60646C');
  });
});
