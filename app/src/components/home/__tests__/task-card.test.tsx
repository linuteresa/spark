import { fireEvent, render, screen } from '@testing-library/react-native';

import { TaskCard } from '@/components/home/task-card';
import { fakeAssignment, fakeCheckIn } from '@/test-utils/fixtures';

describe('TaskCard', () => {
  it('shows a placeholder when there is no assignment yet', () => {
    render(<TaskCard assignment={null} checkIn={null} onToggle={() => {}} completing={false} />);
    expect(screen.getByText('No task yet')).toBeTruthy();
  });

  it('shows the matched action text and tags when checked in', () => {
    render(<TaskCard assignment={fakeAssignment} checkIn={fakeCheckIn} onToggle={() => {}} completing={false} />);
    expect(screen.getByText(fakeAssignment.action_matrix!.action_text)).toBeTruthy();
    expect(screen.getByText(fakeAssignment.ai_note!)).toBeTruthy();
    expect(screen.getByText("Let's finish your task!")).toBeTruthy();
  });

  it('shows the done state once completed_at is set', () => {
    render(
      <TaskCard
        assignment={{ ...fakeAssignment, completed_at: '2026-01-01T12:00:00.000Z' }}
        checkIn={fakeCheckIn}
        onToggle={() => {}}
        completing={false}
      />
    );
    expect(screen.getByText("Today's task, done!")).toBeTruthy();
  });

  it('fires onToggle when the checkbox is pressed', () => {
    const onToggle = jest.fn();
    render(<TaskCard assignment={fakeAssignment} checkIn={fakeCheckIn} onToggle={onToggle} completing={false} />);
    fireEvent.press(screen.getByTestId('task-card-toggle'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
