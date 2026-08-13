import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { RechargeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { EMOTIONS, type Emotion, type JournalEntry } from '@/lib/types';

const PROMPTS: Record<Emotion, string> = {
  anxious: "What's the smallest part of this you could name right now?",
  sad: 'What would feel gentle to do for yourself today?',
  foggy: 'What is one thing you know for sure right now?',
  restless: "What's pulling at your attention today?",
  okay: 'What went okay today, specifically?',
  happy: "What's one thing you want to remember about today?",
};

interface MinimalSpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface MinimalSpeechRecognition {
  lang: string;
  start: () => void;
  onresult: ((event: MinimalSpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function useWebDictation(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const supported =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  function start() {
    if (!supported) return;
    const Recognition =
      (window as unknown as { webkitSpeechRecognition?: new () => MinimalSpeechRecognition })
        .webkitSpeechRecognition ??
      (window as unknown as { SpeechRecognition?: new () => MinimalSpeechRecognition }).SpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: MinimalSpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  }

  return { supported, listening, start };
}

export function JournalTab() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [body, setBody] = useState('');
  const [promptUsed, setPromptUsed] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dictation = useWebDictation((text) => setBody((prev) => (prev ? `${prev} ${text}` : text)));

  async function load() {
    if (!session) return;
    setLoading(true);
    const { data } = await supabase
      .from('journal_entry')
      .select('*')
      .order('created_at', { ascending: false });
    setEntries((data as JournalEntry[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [session]);

  async function save() {
    if (!session || !body.trim()) return;
    setSaving(true);
    try {
      await supabase.from('journal_entry').insert({
        user_id: session.user.id,
        body: body.trim(),
        prompt_used: promptUsed,
      });
      setBody('');
      setPromptUsed(null);
      setComposing(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  if (composing) {
    return (
      <View style={styles.composer}>
        <ThemedText type="smallBold">Need a prompt?</ThemedText>
        <View style={styles.promptRow}>
          {EMOTIONS.map((e) => (
            <Pressable
              key={e.value}
              onPress={() => setPromptUsed(PROMPTS[e.value])}
              style={[styles.promptChip, { backgroundColor: RechargeTheme.card }]}>
              <ThemedText type="small">{e.label}</ThemedText>
            </Pressable>
          ))}
        </View>
        {promptUsed && (
          <ThemedText type="small" style={{ color: RechargeTheme.textSecondary }}>
            {promptUsed}
          </ThemedText>
        )}

        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Write it out…"
          multiline
          style={[styles.textArea, { backgroundColor: RechargeTheme.card }]}
        />

        {dictation.supported && (
          <Button
            label={dictation.listening ? 'Listening…' : '🎤 Dictate'}
            onPress={dictation.start}
            variant="outline"
            color={RechargeTheme.accent}
            disabled={dictation.listening}
          />
        )}

        <View style={styles.composerActions}>
          <Button
            label="Cancel"
            onPress={() => setComposing(false)}
            variant="outline"
            color={RechargeTheme.accent}
            style={styles.flexButton}
          />
          <Button
            label="Save entry"
            onPress={save}
            loading={saving}
            disabled={!body.trim()}
            color={RechargeTheme.accent}
            style={styles.flexButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <Button label="+ Add new entry" onPress={() => setComposing(true)} color={RechargeTheme.accent} />

      {loading && <ActivityIndicator />}

      {!loading && entries.length === 0 && (
        <ThemedText type="small" style={{ color: RechargeTheme.textSecondary }}>
          No journal entries yet.
        </ThemedText>
      )}

      {entries.map((entry) => (
        <View key={entry.id} style={[styles.entryCard, { backgroundColor: RechargeTheme.card }]}>
          <ThemedText type="small" style={{ color: RechargeTheme.textSecondary }}>
            {formatDate(entry.created_at)}
          </ThemedText>
          <ThemedText type="default">{entry.body}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  entryCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  composer: {
    gap: Spacing.three,
  },
  promptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  promptChip: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
  textArea: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  composerActions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  flexButton: {
    flex: 1,
  },
});
