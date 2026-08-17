import { render } from '@testing-library/react-native';

import { WaveBackground } from '@/components/ui/wave-background';

describe('WaveBackground', () => {
  it('renders without crashing', () => {
    const result = render(<WaveBackground />);
    expect(result.toJSON()).toBeTruthy();
  });
});
