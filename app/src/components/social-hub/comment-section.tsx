import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SocialTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import type { FeedComment } from '@/lib/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface CommentSectionProps {
  postId: string;
  comments: FeedComment[];
  myUserId: string;
  onChanged: () => void;
}

export function CommentSection({ postId, comments, myUserId, onChanged }: CommentSectionProps) {
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!draft.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from('feed_comment').insert({ post_id: postId, user_id: myUserId, body: draft.trim() });
      setDraft('');
      onChanged();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(commentId: string) {
    await supabase.from('feed_comment').delete().eq('id', commentId);
    onChanged();
  }

  return (
    <View style={styles.container}>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.comment}>
          <View style={styles.commentHeader}>
            <ThemedText type="smallBold">
              {comment.profiles?.display_name ?? comment.profiles?.email ?? 'A student'}
            </ThemedText>
            <ThemedText type="small" style={{ color: SocialTheme.textSecondary }}>
              {formatDate(comment.created_at)}
            </ThemedText>
          </View>
          <ThemedText type="small">{comment.body}</ThemedText>
          {comment.user_id === myUserId && (
            <Pressable onPress={() => remove(comment.id)}>
              <ThemedText type="small" style={{ color: SocialTheme.textSecondary }}>
                Delete
              </ThemedText>
            </Pressable>
          )}
        </View>
      ))}

      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a comment…"
          style={styles.input}
        />
        <Pressable onPress={submit} disabled={!draft.trim() || submitting}>
          <ThemedText type="smallBold" style={{ color: SocialTheme.accent }}>
            {submitting ? '…' : 'Send'}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  comment: {
    gap: Spacing.half,
  },
  commentHeader: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: SocialTheme.accentSoft,
    paddingVertical: Spacing.one,
  },
});
