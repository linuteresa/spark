import { fireEvent, render, screen } from '@testing-library/react-native';

import { EnergyStep } from '@/components/check-in/energy-step';

describe('EnergyStep', () => {
  it('renders every energy level with its description', () => {
    render(<EnergyStep value={null} onChange={() => {}} onNext={() => {}} onBack={() => {}} />);
    expect(screen.getByText('Low Energy')).toBeTruthy();
    expect(screen.getByText('Real-world outreach or group participation.')).toBeTruthy();
  });

  it('calls onChange with the numeric level', () => {
    const onChange = jest.fn();
    render(<EnergyStep value={null} onChange={onChange} onNext={() => {}} onBack={() => {}} />);
    fireEvent.press(screen.getByText('Medium Energy'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onBack when Back is tapped', () => {
    const onBack = jest.fn();
    render(<EnergyStep value={1} onChange={() => {}} onNext={() => {}} onBack={onBack} />);
    fireEvent.press(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
