import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import * as mockAuthContext from '@/test-utils/auth-mock';
import { resetMockAuthState, setMockAuthState } from '@/test-utils/auth-mock';
import { fakeJournalEntry, fakeSession } from '@/test-utils/fixtures';
import { queueResponse, resetSupabaseMock, supabase as mockSupabaseClient } from '@/test-utils/supabase-mock';

import { JournalTab } from '@/components/recharge/journal-tab';

jest.mock('@/lib/supabase', () => ({ supabase: mockSupabaseClient }));
jest.mock('@/lib/auth-context', () => mockAuthContext);

describe('JournalTab', () => {
  beforeEach(() => {
    resetSupabaseMock();
    resetMockAuthState();
    setMockAuthState({ session: fakeSession });
  });

  it('shows an empty state when there are no entries', async () => {
    queueResponse('journal_entry', { data: [], error: null });
    render(<JournalTab />);
    await waitFor(() => expect(screen.getByText('No journal entries yet.')).toBeTruthy());
  });

  it('lists existing journal entries', async () => {
    queueResponse('journal_entry', { data: [fakeJournalEntry], error: null });
    render(<JournalTab />);
    await waitFor(() => expect(screen.getByText(fakeJournalEntry.body)).toBeTruthy());
  });

  it('opens the composer, picks a prompt, and saves a new entry', async () => {
    queueResponse('journal_entry', { data: [], error: null });
    render(<JournalTab />);
    await waitFor(() => expect(screen.getByText('No journal entries yet.')).toBeTruthy());

    fireEvent.press(screen.getByText('+ Add new entry'));
    expect(screen.getByText('Need a prompt?')).toBeTruthy();

    fireEvent.press(screen.getByText('Happy'));
    expect(screen.getByText("What's one thing you want to remember about today?")).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('Write it out…'), 'A good day overall.');

    queueResponse('journal_entry', { data: null, error: null }); // insert result
    queueResponse('journal_entry', { data: [fakeJournalEntry], error: null }); // reload after save

    await act(async () => {
      fireEvent.press(screen.getByText('Save entry'));
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.queryByText('Need a prompt?')).toBeNull());
  });

  it('cancels out of the composer without saving', async () => {
    queueResponse('journal_entry', { data: [], error: null });
    render(<JournalTab />);
    await waitFor(() => expect(screen.getByText('No journal entries yet.')).toBeTruthy());

    fireEvent.press(screen.getByText('+ Add new entry'));
    fireEvent.press(screen.getByText('Cancel'));
    expect(screen.getByText('+ Add new entry')).toBeTruthy();
  });

  it('does not fetch or save entries when there is no session', async () => {
    setMockAuthState({ session: null });
    render(<JournalTab />);
    expect(screen.getByText('+ Add new entry')).toBeTruthy();

    fireEvent.press(screen.getByText('+ Add new entry'));
    fireEvent.changeText(screen.getByPlaceholderText('Write it out…'), 'Should not save.');
    fireEvent.press(screen.getByText('Save entry'));

    await Promise.resolve();
    expect(mockSupabaseClient.from).not.toHaveBeenCalledWith('journal_entry');
  });
});
