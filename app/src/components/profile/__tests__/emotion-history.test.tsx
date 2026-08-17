import { render, screen } from '@testing-library/react-native';

import { EmotionHistory } from '@/components/profile/emotion-history';
import { fakeCheckIn } from '@/test-utils/fixtures';

describe('EmotionHistory', () => {
  it('shows an empty state with no check-ins', () => {
    render(<EmotionHistory checkIns={[]} />);
    expect(screen.getByText('No check-ins yet.')).toBeTruthy();
  });

  it('lists each check-in entry', () => {
    render(<EmotionHistory checkIns={[fakeCheckIn, { ...fakeCheckIn, id: 'fake-checkin-2', emotion: 'happy' }]} />);
    expect(screen.getByText('okay')).toBeTruthy();
    expect(screen.getByText('happy')).toBeTruthy();
  });
});
