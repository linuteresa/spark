import { render, screen } from '@testing-library/react-native';

import { CircleArrowButton } from '@/components/ui/circle-icon-button';
import { MoodStep } from '@/components/check-in/mood-step';

describe('MoodStep', () => {
  it('renders the heading and week strip', () => {
    render(<MoodStep value={null} onChange={() => {}} onNext={() => {}} />);
    expect(screen.getByText('How are you feeling today?')).toBeTruthy();
  });

  it('disables the next button until a mood is picked', () => {
    const result = render(<MoodStep value={null} onChange={() => {}} onNext={() => {}} />);
    expect(result.UNSAFE_getByType(CircleArrowButton).props.disabled).toBe(true);
  });

  it('enables the next button once a mood is selected and wires onNext through', () => {
    const onNext = jest.fn();
    const result = render(<MoodStep value="happy" onChange={() => {}} onNext={onNext} />);
    const arrowButton = result.UNSAFE_getByType(CircleArrowButton);
    expect(arrowButton.props.disabled).toBe(false);
    arrowButton.props.onPress();
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
