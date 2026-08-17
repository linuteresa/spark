import { fireEvent, render, screen } from '@testing-library/react-native';

import { BreatheTab } from '@/components/recharge/breathe-tab';

describe('BreatheTab', () => {
  it('lists all breathing patterns', () => {
    render(<BreatheTab />);
    expect(screen.getByText('Box Breathing')).toBeTruthy();
    expect(screen.getByText('4-7-8 Relaxation')).toBeTruthy();
    expect(screen.getByText('Simple Deep Breath')).toBeTruthy();
  });

  it('starts a pattern and shows the first phase label', () => {
    render(<BreatheTab />);
    fireEvent.press(screen.getByText('Box Breathing'));
    expect(screen.getByText('Breathe in')).toBeTruthy();
    expect(screen.queryByText('Box Breathing')).toBeNull();
  });

  it('exits the active pattern back to the list', () => {
    render(<BreatheTab />);
    fireEvent.press(screen.getByText('Simple Deep Breath'));
    fireEvent.press(screen.getByText('Done'));
    expect(screen.getByText('Simple Deep Breath')).toBeTruthy();
  });
});
