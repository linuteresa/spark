import { fireEvent, render, screen } from '@testing-library/react-native';

import { StepActions } from '@/components/check-in/step-actions';

describe('StepActions', () => {
  it('fires onBack and onNext', () => {
    const onBack = jest.fn();
    const onNext = jest.fn();
    render(<StepActions onBack={onBack} onNext={onNext} />);

    fireEvent.press(screen.getByText('Back'));
    fireEvent.press(screen.getByText('Continue'));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('renders a custom nextLabel', () => {
    render(<StepActions onBack={() => {}} onNext={() => {}} nextLabel="Saving…" />);
    expect(screen.getByText('Saving…')).toBeTruthy();
  });

  it('shows a spinner instead of the label while nextLoading', () => {
    render(<StepActions onBack={() => {}} onNext={() => {}} nextLabel="Saving…" nextLoading />);
    expect(screen.queryByText('Saving…')).toBeNull();
  });

  it('does not fire onNext when nextDisabled', () => {
    const onNext = jest.fn();
    render(<StepActions onBack={() => {}} onNext={onNext} nextDisabled />);
    fireEvent.press(screen.getByText('Continue'));
    expect(onNext).not.toHaveBeenCalled();
  });
});
