import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';

import { queueResponse, resetSupabaseMock, supabase as mockSupabaseClient } from '@/test-utils/supabase-mock';

import { SubstressorStep } from '@/components/check-in/substressor-step';

jest.mock('@/lib/supabase', () => ({ supabase: mockSupabaseClient }));

const options = [
  { code: 'exam-stress', pillar: 'education' as const, label: 'Exam stress', sort_order: 1 },
  { code: 'homesick', pillar: 'education' as const, label: 'Homesickness', sort_order: 2 },
];

describe('SubstressorStep', () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  it('loads and lists the substressor options for the given pillar', async () => {
    queueResponse('sub_stressors', { data: options, error: null });
    render(
      <SubstressorStep pillar="education" value={null} onChange={() => {}} onSubmit={() => {}} onBack={() => {}} submitting={false} />
    );
    await waitFor(() => expect(screen.getByText('Exam stress')).toBeTruthy());
    expect(screen.getByText('Homesickness')).toBeTruthy();
  });

  it('calls onChange when an option is tapped', async () => {
    queueResponse('sub_stressors', { data: options, error: null });
    const onChange = jest.fn();
    render(
      <SubstressorStep pillar="education" value={null} onChange={onChange} onSubmit={() => {}} onBack={() => {}} submitting={false} />
    );
    await waitFor(() => expect(screen.getByText('Exam stress')).toBeTruthy());
    fireEvent.press(screen.getByText('Exam stress'));
    expect(onChange).toHaveBeenCalledWith('exam-stress');
  });

  it('disables the submit action until a value is chosen', async () => {
    queueResponse('sub_stressors', { data: [], error: null });
    const onSubmit = jest.fn();
    const result = render(
      <SubstressorStep pillar="social" value={null} onChange={() => {}} onSubmit={onSubmit} onBack={() => {}} submitting={false} />
    );
    await waitFor(() => expect(result.UNSAFE_queryByType(ActivityIndicator)).toBeNull());
    fireEvent.press(screen.getByText("That's it"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('re-fetches options when the pillar prop changes', async () => {
    queueResponse('sub_stressors', { data: options, error: null });
    const { rerender } = render(
      <SubstressorStep pillar="education" value={null} onChange={() => {}} onSubmit={() => {}} onBack={() => {}} submitting={false} />
    );
    await waitFor(() => expect(screen.getByText('Exam stress')).toBeTruthy());

    queueResponse('sub_stressors', { data: [{ code: 'money', pillar: 'health_personal' as const, label: 'Money stress', sort_order: 1 }], error: null });
    rerender(
      <SubstressorStep pillar="health_personal" value={null} onChange={() => {}} onSubmit={() => {}} onBack={() => {}} submitting={false} />
    );
    await waitFor(() => expect(screen.getByText('Money stress')).toBeTruthy());
  });
});
