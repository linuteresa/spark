import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { fakeFeedComment, fakeUser, fakeUser2 } from '@/test-utils/fixtures';
import { resetSupabaseMock, supabase as mockSupabaseClient } from '@/test-utils/supabase-mock';

import { CommentSection } from '@/components/social-hub/comment-section';

jest.mock('@/lib/supabase', () => ({ supabase: mockSupabaseClient }));

describe('CommentSection', () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  it('renders a comment with the author display name', () => {
    render(<CommentSection postId="p1" comments={[fakeFeedComment]} myUserId={fakeUser.id} onChanged={() => {}} />);
    expect(screen.getByText('Second Terp')).toBeTruthy();
    expect(screen.getByText(fakeFeedComment.body)).toBeTruthy();
  });

  it('falls back to email when there is no display name', () => {
    const noName = { ...fakeFeedComment, profiles: { display_name: null, email: fakeUser2.email! } };
    render(<CommentSection postId="p1" comments={[noName]} myUserId={fakeUser.id} onChanged={() => {}} />);
    expect(screen.getByText(fakeUser2.email!)).toBeTruthy();
  });

  it('only shows Delete on my own comment', () => {
    render(
      <CommentSection
        postId="p1"
        comments={[fakeFeedComment, { ...fakeFeedComment, id: 'c2', user_id: fakeUser.id, body: 'mine' }]}
        myUserId={fakeUser.id}
        onChanged={() => {}}
      />
    );
    expect(screen.getAllByText('Delete')).toHaveLength(1);
  });

  it('disables Send until there is draft text, then submits and clears it', async () => {
    const onChanged = jest.fn();
    render(<CommentSection postId="p1" comments={[]} myUserId={fakeUser.id} onChanged={onChanged} />);

    const sendButton = screen.getByText('Send');
    fireEvent.press(sendButton);
    expect(mockSupabaseClient.from).not.toHaveBeenCalledWith('feed_comment');

    fireEvent.changeText(screen.getByPlaceholderText('Add a comment…'), 'Nice work!');
    fireEvent.press(screen.getByText('Send'));

    await screen.findByPlaceholderText('Add a comment…');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('feed_comment');
    expect(onChanged).toHaveBeenCalledTimes(1);
  });

  it('deletes a comment and reports the change', async () => {
    const onChanged = jest.fn();
    render(
      <CommentSection
        postId="p1"
        comments={[{ ...fakeFeedComment, user_id: fakeUser.id }]}
        myUserId={fakeUser.id}
        onChanged={onChanged}
      />
    );
    fireEvent.press(screen.getByText('Delete'));
    await waitFor(() => expect(onChanged).toHaveBeenCalledTimes(1));
  });
});
