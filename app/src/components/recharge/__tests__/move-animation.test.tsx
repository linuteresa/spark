import { render } from '@testing-library/react-native';

import { MoveAnimation, type MoveKind } from '@/components/recharge/move-animation';

describe('MoveAnimation', () => {
  it.each(['stretch', 'shoulders', 'walk', 'shake'] as MoveKind[])('renders the %s animation without crashing', (kind) => {
    const result = render(<MoveAnimation kind={kind} />);
    expect(result.toJSON()).toBeTruthy();
  });
});
