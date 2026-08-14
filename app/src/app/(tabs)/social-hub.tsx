import { useRef, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { EventsTab } from '@/components/social-hub/events-tab';
import { FeedTab, type FeedTabHandle } from '@/components/social-hub/feed-tab';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { SocialTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';

type SocialView = 'feed' | 'events';

export default function SocialHubScreen() {
  const [view, setView] = useState<SocialView>('feed');
  const [refreshing, setRefreshing] = useState(false);
  const feedRef = useRef<FeedTabHandle>(null);

  async function onRefresh() {
    setRefreshing(true);
    await feedRef.current?.refresh();
    setRefreshing(false);
  }

  return (
    <ScreenContainer
      backgroundColor={SocialTheme.background}
      refreshControl={
        view === 'feed' ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={SocialTheme.accent} />
        ) : undefined
      }>
      <ThemedText type="title" style={{ color: SocialTheme.text }}>
        SOCIAL HUB
      </ThemedText>

      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setView('feed')}
          style={[styles.toggle, view === 'feed' && { backgroundColor: SocialTheme.accent }]}>
          <ThemedText type="smallBold" style={view === 'feed' ? styles.activeLabel : { color: SocialTheme.accent }}>
            Campus Feed
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setView('events')}
          style={[styles.toggle, view === 'events' && { backgroundColor: SocialTheme.accent }]}>
          <ThemedText
            type="smallBold"
            style={view === 'events' ? styles.activeLabel : { color: SocialTheme.accent }}>
            Student Events
          </ThemedText>
        </Pressable>
      </View>

      {view === 'feed' ? <FeedTab ref={feedRef} /> : <EventsTab />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    borderRadius: Spacing.five,
    borderWidth: 2,
    borderColor: SocialTheme.accent,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  toggle: {
    flex: 1,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
});
