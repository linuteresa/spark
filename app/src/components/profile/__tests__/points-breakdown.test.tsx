import { render, screen } from '@testing-library/react-native';

import { PointsBreakdown } from '@/components/profile/points-breakdown';
import { fakePointsLedger } from '@/test-utils/fixtures';

describe('PointsBreakdown', () => {
  it('renders totals and history rows for a non-empty ledger', () => {
    render(<PointsBreakdown ledger={fakePointsLedger} />);
    expect(screen.getByText('This week')).toBeTruthy();
    expect(screen.getByText('All time')).toBeTruthy();
    expect(screen.getByText('+10')).toBeTruthy();
    expect(screen.getByText('+30')).toBeTruthy();
    expect(screen.getByText('Daily check-in')).toBeTruthy();
    expect(screen.getByText('Task completed')).toBeTruthy();
  });

  it('falls back to the raw source string for an unknown source', () => {
    render(
      <PointsBreakdown
        ledger={[{ id: 'x', user_id: 'u', source: 'mystery_bonus', amount: 5, created_at: new Date().toISOString() }]}
      />
    );
    expect(screen.getByText('mystery_bonus')).toBeTruthy();
  });

  it('handles an empty ledger', () => {
    render(<PointsBreakdown ledger={[]} />);
    expect(screen.getAllByText('0')).toHaveLength(2);
  });
});
