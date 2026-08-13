import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { SocialTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { REACTIONS, type FeedPost, type FeedReaction, type ReactionType } from '@/lib/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function ReactionBar({
  postId,
  reactions,
  myUserId,
  onChanged,
}: {
  postId: string;
  reactions: FeedReaction[];
  myUserId: string;
  onChanged: () => void;
}) {
  const mine = reactions.find((r) => r.user_id === myUserId);

  async function toggle(type: ReactionType) {
    if (mine && mine.reaction_type === type) {
      await supabase.from('feed_reaction').delete().eq('post_id', postId).eq('user_id', myUserId);
    } else if (mine) {
      await supabase
        .from('feed_reaction')
        .update({ reaction_type: type })
        .eq('post_id', postId)
        .eq('user_id', myUserId);
    } else {
      await supabase.from('feed_reaction').insert({ post_id: postId, user_id: myUserId, reaction_type: type });
    }
    onChanged();
  }

  const counts = REACTIONS.map((r) => ({
    ...r,
    count: reactions.filter((x) => x.reaction_type === r.value).length,
  }));

  return (
    <View style={styles.reactionRow}>
      {counts.map((r) => (
        <Pressable
          key={r.value}
          onPress={() => toggle(r.value)}
          style={[
            styles.reactionChip,
            mine?.reaction_type === r.value && { backgroundColor: SocialTheme.accentSoft },
          ]}>
          <ThemedText type="small">
            {r.emoji} {r.count > 0 ? r.count : ''}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

export function FeedTab() {
  const { session, profile } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [reactionsByPost, setReactionsByPost] = useState<Record<string, FeedReaction[]>>({});
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  async function load() {
    setLoading(true);
    const { data: postData } = await supabase
      .from('feed_post')
      .select('*, profiles(display_name, email)')
      .order('created_at', { ascending: false })
      .limit(30);

    const list = (postData as FeedPost[]) ?? [];
    setPosts(list);

    if (list.length > 0) {
      const { data: reactionData } = await supabase
        .from('feed_reaction')
        .select('*')
        .in('post_id', list.map((p) => p.id));
      const grouped: Record<string, FeedReaction[]> = {};
      for (const r of (reactionData as FeedReaction[]) ?? []) {
        grouped[r.post_id] = grouped[r.post_id] ? [...grouped[r.post_id], r] : [r];
      }
      setReactionsByPost(grouped);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [session]);

  async function submitPost() {
    if (!session || !body.trim()) return;
    setPosting(true);
    try {
      await supabase
        .from('feed_post')
        .insert({ user_id: session.user.id, school_id: profile?.school_id, body: body.trim() });
      setBody('');
      setComposing(false);
      await load();
    } finally {
      setPosting(false);
    }
  }

  if (profile?.feed_opt_out) {
    return (
      <ThemedText type="small" style={{ color: SocialTheme.textSecondary }}>
        You've opted out of the campus feed in Settings.
      </ThemedText>
    );
  }

  return (
    <View style={styles.container}>
      {!composing ? (
        <Button label="Share a reflection" onPress={() => setComposing(true)} color={SocialTheme.accent} />
      ) : (
        <View style={[styles.composer, { backgroundColor: SocialTheme.card }]}>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="What happened today?"
            multiline
            style={styles.textArea}
          />
          <View style={styles.composerActions}>
            <Button
              label="Cancel"
              onPress={() => setComposing(false)}
              variant="outline"
              color={SocialTheme.accent}
              style={styles.flexButton}
            />
            <Button
              label="Post"
              onPress={submitPost}
              loading={posting}
              disabled={!body.trim()}
              color={SocialTheme.accent}
              style={styles.flexButton}
            />
          </View>
        </View>
      )}

      {loading && <ActivityIndicator />}

      {posts.map((post) => (
        <View key={post.id} style={[styles.postCard, { backgroundColor: SocialTheme.card }]}>
          <ThemedText type="smallBold">
            {post.profiles?.display_name ?? post.profiles?.email ?? 'A student'}
          </ThemedText>
          <ThemedText type="small" style={{ color: SocialTheme.textSecondary }}>
            {formatDate(post.created_at)}
          </ThemedText>
          {post.body && <ThemedText type="default">{post.body}</ThemedText>}
          {session && (
            <ReactionBar
              postId={post.id}
              reactions={reactionsByPost[post.id] ?? []}
              myUserId={session.user.id}
              onChanged={load}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  composer: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  composerActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  flexButton: {
    flex: 1,
  },
  postCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  reactionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  reactionChip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.five,
  },
});
