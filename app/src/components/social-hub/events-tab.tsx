import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { SocialTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { EventKind, StudentEvent } from '@/lib/types';

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function CreateEventForm({ onDone }: { onDone: () => void }) {
  const { session, profile } = useAuth();
  const [kind, setKind] = useState<EventKind>('student');
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [about, setAbout] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!session || !profile || !title.trim() || !eventDate.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('student_event').insert({
        school_id: profile.school_id,
        created_by: session.user.id,
        kind,
        title: title.trim(),
        about: about.trim() || null,
        event_date: eventDate.trim(),
      });
      if (insertError) throw insertError;
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create event.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={[styles.form, { backgroundColor: SocialTheme.card }]}>
      <ThemedText type="smallBold">Is this a club or student event?</ThemedText>
      <View style={styles.row}>
        <Chip label="Club" selected={kind === 'club'} onPress={() => setKind('club')} color={SocialTheme.accent} />
        <Chip
          label="Student"
          selected={kind === 'student'}
          onPress={() => setKind('student')}
          color={SocialTheme.accent}
        />
      </View>

      <TextInput value={title} onChangeText={setTitle} placeholder="Event title" style={styles.input} />
      <TextInput
        value={eventDate}
        onChangeText={setEventDate}
        placeholder="Date (YYYY-MM-DD)"
        style={styles.input}
      />
      <TextInput
        value={about}
        onChangeText={setAbout}
        placeholder="What's this about?"
        multiline
        style={[styles.input, styles.textArea]}
      />

      {error && <ThemedText style={styles.error}>{error}</ThemedText>}

      <View style={styles.row}>
        <Button label="Cancel" onPress={onDone} variant="outline" color={SocialTheme.accent} style={styles.flexButton} />
        <Button
          label="Create event"
          onPress={save}
          loading={saving}
          disabled={!title.trim() || !eventDate.trim()}
          color={SocialTheme.accent}
          style={styles.flexButton}
        />
      </View>
    </View>
  );
}

export interface EventsTabHandle {
  refresh: () => Promise<void>;
}

export const EventsTab = forwardRef<EventsTabHandle>(function EventsTab(_props, ref) {
  const { session } = useAuth();
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [attending, setAttending] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  async function loadAttending() {
    if (!session) return;
    const { data: mine } = await supabase
      .from('student_event_attendee')
      .select('event_id')
      .eq('user_id', session.user.id);
    setAttending(new Set((mine ?? []).map((r) => r.event_id)));
  }

  async function load(silent = false) {
    if (!silent) setLoading(true);
    const { data } = await supabase
      .from('student_event')
      .select('*')
      .order('event_date', { ascending: true })
      .range(0, PAGE_SIZE - 1);
    const list = (data as StudentEvent[]) ?? [];
    setEvents(list);
    setHasMore(list.length === PAGE_SIZE);
    await loadAttending();
    if (!silent) setLoading(false);
  }

  useImperativeHandle(ref, () => ({
    refresh: () => load(true),
  }));

  async function loadMore() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const { data } = await supabase
      .from('student_event')
      .select('*')
      .order('event_date', { ascending: true })
      .range(events.length, events.length + PAGE_SIZE - 1);
    const list = (data as StudentEvent[]) ?? [];
    setEvents((prev) => [...prev, ...list]);
    setHasMore(list.length === PAGE_SIZE);
    setLoadingMore(false);
  }

  useEffect(() => {
    load();
  }, [session]);

  async function toggleJoin(eventId: string) {
    if (!session) return;
    if (attending.has(eventId)) {
      await supabase.from('student_event_attendee').delete().eq('event_id', eventId).eq('user_id', session.user.id);
    } else {
      await supabase.from('student_event_attendee').insert({ event_id: eventId, user_id: session.user.id });
    }
    await loadAttending();
  }

  if (creating) {
    return <CreateEventForm onDone={() => { setCreating(false); load(); }} />;
  }

  const today = todayIso();
  const filtered = events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search events…"
          style={[styles.input, styles.searchInput]}
        />
        <Pressable
          onPress={() => setCreating(true)}
          style={[styles.plusButton, { backgroundColor: SocialTheme.accent }]}>
          <ThemedText type="smallBold" style={styles.plusLabel}>
            +
          </ThemedText>
        </Pressable>
      </View>

      {loading && <ActivityIndicator />}

      {filtered.map((event) => {
        const ended = event.event_date < today;
        return (
          <View key={event.id} style={[styles.eventCard, { backgroundColor: SocialTheme.card }]}>
            <View style={styles.row}>
              <ThemedText type="small" style={{ color: SocialTheme.accent }}>
                {event.kind === 'club' ? 'CLUB' : 'STUDENT'}
              </ThemedText>
              <ThemedText type="small" style={{ color: SocialTheme.textSecondary }}>
                {formatDate(event.event_date)}
              </ThemedText>
            </View>
            <ThemedText type="smallBold">{event.title}</ThemedText>
            {event.about && (
              <ThemedText type="small" style={{ color: SocialTheme.textSecondary }}>
                {event.about}
              </ThemedText>
            )}
            {ended ? (
              <ThemedText type="small" style={{ color: SocialTheme.textSecondary }}>
                Already ended
              </ThemedText>
            ) : (
              <Button
                label={attending.has(event.id) ? 'Joined ✓' : 'Join'}
                onPress={() => toggleJoin(event.id)}
                variant={attending.has(event.id) ? 'outline' : 'solid'}
                color={SocialTheme.accent}
              />
            )}
          </View>
        );
      })}

      {!loading && hasMore && (
        <Button
          label={loadingMore ? 'Loading…' : 'Load more'}
          onPress={loadMore}
          loading={loadingMore}
          variant="outline"
          color={SocialTheme.accent}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusLabel: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  flexButton: {
    flex: 1,
  },
  form: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  eventCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  error: {
    color: '#cf222e',
  },
});
