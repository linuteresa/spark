import { fireEvent, render, screen } from '@testing-library/react-native';

import { PillarStep } from '@/components/check-in/pillar-step';
import { PILLARS } from '@/lib/types';

describe('PillarStep', () => {
  it('renders every pillar option', () => {
    render(<PillarStep value={null} onChange={() => {}} onNext={() => {}} onBack={() => {}} />);
    for (const pillar of PILLARS) {
      expect(screen.getByText(pillar.label)).toBeTruthy();
    }
  });

  it('calls onChange with the tapped pillar', () => {
    const onChange = jest.fn();
    render(<PillarStep value={null} onChange={onChange} onNext={() => {}} onBack={() => {}} />);
    fireEvent.press(screen.getByText('Career'));
    expect(onChange).toHaveBeenCalledWith('career');
  });

  it('disables Continue until a pillar is chosen', () => {
    const onNext = jest.fn();
    render(<PillarStep value={null} onChange={() => {}} onNext={onNext} onBack={() => {}} />);
    fireEvent.press(screen.getByText('Continue'));
    expect(onNext).not.toHaveBeenCalled();
  });
});
