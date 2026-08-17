import { render, screen } from '@testing-library/react-native';

import { WeekStrip } from '@/components/check-in/week-strip';

describe('WeekStrip', () => {
  it('renders all seven day labels', () => {
    render(<WeekStrip />);
    for (const label of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it("renders today's date number", () => {
    render(<WeekStrip />);
    const today = new Date().getDate().toString();
    expect(screen.getByText(today)).toBeTruthy();
  });
});
