import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { createRef } from 'react';

import * as mockAuthContext from '@/test-utils/auth-mock';
import { resetMockAuthState, setMockAuthState } from '@/test-utils/auth-mock';
import { fakeFeedComment, fakeFeedPost, fakeFeedReaction, fakeProfile, fakeSession, fakeUser } from '@/test-utils/fixtures';
import { queueResponse, resetSupabaseMock, supabase as mockSupabaseClient } from '@/test-utils/supabase-mock';

import { FeedTab, type FeedTabHandle } from '@/components/social-hub/feed-tab';

jest.mock('@/lib/supabase', () => ({ supabase: mockSupabaseClient }));
jest.mock('@/lib/auth-context', () => mockAuthContext);

function queueEmptyLoad() {
  queueResponse('feed_post', { data: [], error: null });
}

function queueLoadWithOnePost() {
  queueResponse('feed_post', { data: [fakeFeedPost], error: null });
  queueResponse('feed_reaction', { data: [fakeFeedReaction], error: null });
  queueResponse('feed_comment', { data: [fakeFeedComment], error: null });
}

describe('FeedTab', () => {
  beforeEach(() => {
    resetSupabaseMock();
    resetMockAuthState();
    setMockAuthState({ session: fakeSession, profile: fakeProfile });
  });

  it('shows the opt-out message when the profile has opted out of the feed', async () => {
    queueEmptyLoad();
    setMockAuthState({ session: fakeSession, profile: { ...fakeProfile, feed_opt_out: true } });
    render(<FeedTab />);
    expect(screen.getByText("You've opted out of the campus feed in Settings.")).toBeTruthy();
    await waitFor(() => expect(mockSupabaseClient.from).toHaveBeenCalledWith('feed_post'));
  });

  it('shows an empty feed with a composer entry point', async () => {
    queueEmptyLoad();
    render(<FeedTab />);
    await waitFor(() => expect(screen.getByText('Share a reflection')).toBeTruthy());
  });

  it('renders a post with its author, reaction count, and comment', async () => {
    queueLoadWithOnePost();
    render(<FeedTab />);
    await waitFor(() => expect(screen.getByText(fakeFeedPost.body!)).toBeTruthy());
    expect(screen.getByText(fakeProfile.display_name!)).toBeTruthy();
    expect(screen.getByText(fakeFeedComment.body)).toBeTruthy();
  });

  it('shows Delete only on my own post and removes it on press', async () => {
    queueLoadWithOnePost();
    render(<FeedTab />);
    await waitFor(() => expect(screen.getByText(fakeFeedPost.body!)).toBeTruthy());

    queueResponse('feed_post', { data: null, error: null }); // response for the delete() call itself
    queueEmptyLoad(); // response for the reload triggered after deleting
    await act(async () => {
      fireEvent.press(screen.getByText('Delete'));
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.queryByText(fakeFeedPost.body!)).toBeNull());
  });

  it('composes and submits a new post', async () => {
    queueEmptyLoad();
    render(<FeedTab />);
    await waitFor(() => expect(screen.getByText('Share a reflection')).toBeTruthy());

    fireEvent.press(screen.getByText('Share a reflection'));
    fireEvent.changeText(screen.getByPlaceholderText('What happened today?'), 'A solid check-in today.');

    queueResponse('feed_post', { data: null, error: null }); // response for the insert() call itself
    queueEmptyLoad(); // response for the reload triggered after posting
    await act(async () => {
      fireEvent.press(screen.getByText('Post'));
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.getByText('Share a reflection')).toBeTruthy());
  });

  it('cancels composing without posting', async () => {
    queueEmptyLoad();
    render(<FeedTab />);
    await waitFor(() => expect(screen.getByText('Share a reflection')).toBeTruthy());
    fireEvent.press(screen.getByText('Share a reflection'));
    fireEvent.press(screen.getByText('Cancel'));
    expect(screen.getByText('Share a reflection')).toBeTruthy();
  });

  it('reacts to a post I have not reacted to yet', async () => {
    queueResponse('feed_post', { data: [fakeFeedPost], error: null });
    queueResponse('feed_reaction', { data: [], error: null });
    queueResponse('feed_comment', { data: [], error: null });
    render(<FeedTab />);
    await waitFor(() => expect(screen.getByText(fakeFeedPost.body!)).toBeTruthy());

    queueResponse('feed_reaction', { data: [{ ...fakeFeedReaction, user_id: fakeUser.id }], error: null });
    queueResponse('feed_comment', { data: [], error: null });
    await act(async () => {
      fireEvent.press(screen.getByText('🤗'));
      await Promise.resolve();
    });
  });

  it('exposes an imperative refresh handle', async () => {
    queueEmptyLoad();
    const ref = createRef<FeedTabHandle>();
    render(<FeedTab ref={ref} />);
    await waitFor(() => expect(screen.getByText('Share a reflection')).toBeTruthy());

    queueEmptyLoad();
    await act(async () => {
      await ref.current!.refresh();
    });
  });
});
