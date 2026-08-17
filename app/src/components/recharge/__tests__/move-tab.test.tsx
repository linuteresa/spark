import { fireEvent, render, screen } from '@testing-library/react-native';

import { MoveTab } from '@/components/recharge/move-tab';

describe('MoveTab', () => {
  it('lists all move prompts', () => {
    render(<MoveTab />);
    expect(screen.getByText('Stand and stretch your arms overhead')).toBeTruthy();
    expect(screen.getByText('Roll your shoulders and neck slowly')).toBeTruthy();
    expect(screen.getByText('Walk to the nearest window and back')).toBeTruthy();
    expect(screen.getByText('Shake out your hands and legs')).toBeTruthy();
  });

  it('starts a countdown and shows the remaining seconds', () => {
    render(<MoveTab />);
    fireEvent.press(screen.getByText('Shake out your hands and legs'));
    expect(screen.getByText('30s')).toBeTruthy();
    expect(screen.getByText('Stop')).toBeTruthy();
  });

  it('exits the countdown back to the list', () => {
    render(<MoveTab />);
    fireEvent.press(screen.getByText('Stand and stretch your arms overhead'));
    fireEvent.press(screen.getByText('Stop'));
    expect(screen.getByText('Stand and stretch your arms overhead')).toBeTruthy();
  });
});
