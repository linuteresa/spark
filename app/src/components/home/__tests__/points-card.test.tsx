import { render, screen } from '@testing-library/react-native';

import { PointsCard } from '@/components/home/points-card';

describe('PointsCard', () => {
  it('shows progress out of the daily goal', () => {
    render(<PointsCard pointsToday={20} />);
    expect(screen.getByText('20/50XP')).toBeTruthy();
  });

  it('clamps progress at the daily goal when points exceed it', () => {
    render(<PointsCard pointsToday={90} />);
    expect(screen.getByText('90/50XP')).toBeTruthy();
  });

  it('handles zero points', () => {
    render(<PointsCard pointsToday={0} />);
    expect(screen.getByText('0/50XP')).toBeTruthy();
  });
});
