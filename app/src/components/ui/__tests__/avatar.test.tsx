import { render, screen } from '@testing-library/react-native';

import { Avatar } from '@/components/ui/avatar';

describe('Avatar', () => {
  it('shows the first letter of the label, uppercased', () => {
    render(<Avatar label="terp" color="#5B8DEF" />);
    expect(screen.getByText('T')).toBeTruthy();
  });

  it('handles an already-uppercase, multi-word label', () => {
    render(<Avatar label="Second Terp" color="#000000" />);
    expect(screen.getByText('S')).toBeTruthy();
  });
});
