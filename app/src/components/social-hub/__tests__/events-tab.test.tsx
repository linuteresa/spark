import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import * as mockAuthContext from '@/test-utils/auth-mock';
import { resetMockAuthState, setMockAuthState } from '@/test-utils/auth-mock';
import { fakeProfile, fakeSession, fakeStudentEvent } from '@/test-utils/fixtures';
import { queueResponse, resetSupabaseMock, supabase as mockSupabaseClient } from '@/test-utils/supabase-mock';

import { EventsTab } from '@/components/social-hub/events-tab';

jest.mock('@/lib/supabase', () => ({ supabase: mockSupabaseClient }));
jest.mock('@/lib/auth-context', () => mockAuthContext);

function queueLoad(events = [fakeStudentEvent], attending: string[] = []) {
  queueResponse('student_event', { data: events, error: null });
  queueResponse('student_event_attendee', { data: attending.map((event_id) => ({ event_id })), error: null });
}

describe('EventsTab', () => {
  beforeEach(() => {
    resetSupabaseMock();
    resetMockAuthState();
    setMockAuthState({ session: fakeSession, profile: fakeProfile });
  });

  it('renders an upcoming event with a Join button', async () => {
    queueLoad();
    render(<EventsTab />);
    await waitFor(() => expect(screen.getByText(fakeStudentEvent.title)).toBeTruthy());
    expect(screen.getByText('Join')).toBeTruthy();
  });

  it('shows an already-ended event without a join action', async () => {
    queueLoad([{ ...fakeStudentEvent, event_date: '2020-01-01' }]);
    render(<EventsTab />);
    await waitFor(() => expect(screen.getByText(fakeStudentEvent.title)).toBeTruthy());
    expect(screen.getByText('Already ended')).toBeTruthy();
    expect(screen.queryByText('Join')).toBeNull();
  });

  it('toggles joining an event', async () => {
    queueLoad();
    render(<EventsTab />);
    await waitFor(() => expect(screen.getByText('Join')).toBeTruthy());

    queueResponse('student_event_attendee', { data: null, error: null }); // response for the insert() call itself
    queueResponse('student_event_attendee', { data: [{ event_id: fakeStudentEvent.id }], error: null }); // reload
    await act(async () => {
      fireEvent.press(screen.getByText('Join'));
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.getByText('Joined ✓')).toBeTruthy());
  });

  it('filters the list by search text', async () => {
    queueLoad();
    render(<EventsTab />);
    await waitFor(() => expect(screen.getByText(fakeStudentEvent.title)).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Search events…'), 'nothing matches this');
    expect(screen.queryByText(fakeStudentEvent.title)).toBeNull();
  });

  it('creates a new event and returns to the list', async () => {
    queueLoad([]);
    render(<EventsTab />);
    await waitFor(() => expect(screen.getByPlaceholderText('Search events…')).toBeTruthy());

    fireEvent.press(screen.getByText('+'));
    expect(screen.getByText('Is this a club or student event?')).toBeTruthy();

    fireEvent.press(screen.getByText('Club'));
    fireEvent.changeText(screen.getByPlaceholderText('Event title'), 'Board game night');
    fireEvent.changeText(screen.getByPlaceholderText('Date (YYYY-MM-DD)'), '2099-06-01');

    queueResponse('student_event', { data: null, error: null }); // response for the insert() call itself
    queueLoad([{ ...fakeStudentEvent, id: 'fake-event-2', title: 'Board game night' }]); // reload after creating
    await act(async () => {
      fireEvent.press(screen.getByText('Create event'));
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.getByText('Board game night')).toBeTruthy());
  });

  it('cancels out of the create-event form', async () => {
    queueLoad();
    render(<EventsTab />);
    await waitFor(() => expect(screen.getByText(fakeStudentEvent.title)).toBeTruthy());
    fireEvent.press(screen.getByText('+'));
    fireEvent.press(screen.getByText('Cancel'));
    await waitFor(() => expect(screen.getByText(fakeStudentEvent.title)).toBeTruthy());
  });

  it('shows Load more when a full page comes back, and loads the next page', async () => {
    const fullPage = Array.from({ length: 10 }, (_, i) => ({
      ...fakeStudentEvent,
      id: `fake-event-${i}`,
      title: `Event ${i}`,
    }));
    queueLoad(fullPage);
    render(<EventsTab />);
    await waitFor(() => expect(screen.getByText('Load more')).toBeTruthy());

    queueResponse('student_event', { data: [], error: null });
    await act(async () => {
      fireEvent.press(screen.getByText('Load more'));
      await Promise.resolve();
    });
  });
});
