import { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { supabase } from "../lib/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "CompleteReflect">;

const MOODS = [1, 2, 3, 4, 5] as const;

// Written input is optional everywhere: three tap-to-insert starters plus
// an equally prominent skip, never a bare free-text field. See the
// architecture doc, "Step three: where written input is genuinely needed".
const PROMPT_STARTERS = [
  "That felt easier than I expected because...",
  "The hardest part was...",
  "I want to remember that...",
];

export function CompleteReflectScreen({ route, navigation }: Props) {
  const { assignmentId } = route.params;
  const [moodBefore, setMoodBefore] = useState<(typeof MOODS)[number] | null>(null);
  const [moodAfter, setMoodAfter] = useState<(typeof MOODS)[number] | null>(null);
  const [note, setNote] = useState("");
  const [promptUsed, setPromptUsed] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!moodBefore || !moodAfter) return;
    setSubmitting(true);
    setError(null);

    // Completion, points, and streak update happen in one transaction on
    // the database side -- see complete_assignment() in
    // supabase/migrations/0009_functions.sql.
    const { error: completeError } = await supabase.rpc("complete_assignment", {
      p_assignment_id: assignmentId,
    });
    if (completeError) {
      setError(completeError.message);
      setSubmitting(false);
      return;
    }

    const { error: reflectError } = await supabase.rpc("reflect_assignment", {
      p_assignment_id: assignmentId,
      p_mood_before: moodBefore,
      p_mood_after: moodAfter,
      p_note: note || null,
      p_prompt_used: promptUsed,
    });

    setSubmitting(false);
    if (reflectError) {
      setError(reflectError.message);
      return;
    }

    navigation.navigate("Streak");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How did you feel before?</Text>
      <View style={styles.row}>
        {MOODS.map((m) => (
          <Pressable
            key={`before-${m}`}
            onPress={() => setMoodBefore(m)}
            style={[styles.chip, moodBefore === m && styles.chipSelected]}
          >
            <Text>{m}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.title}>And after?</Text>
      <View style={styles.row}>
        {MOODS.map((m) => (
          <Pressable
            key={`after-${m}`}
            onPress={() => setMoodAfter(m)}
            style={[styles.chip, moodAfter === m && styles.chipSelected]}
          >
            <Text>{m}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.title}>Want to say more? (optional)</Text>
      <View style={styles.row}>
        {PROMPT_STARTERS.map((starter) => (
          <Pressable
            key={starter}
            onPress={() => {
              setPromptUsed(starter);
              setNote(starter);
            }}
            style={styles.chip}
          >
            <Text numberOfLines={1} style={styles.starter}>
              {starter}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Optional note"
        style={styles.input}
        multiline
      />

      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable
        disabled={!moodBefore || !moodAfter || submitting}
        onPress={submit}
        style={[styles.submit, (!moodBefore || !moodAfter || submitting) && styles.submitDisabled]}
      >
        <Text style={styles.submitText}>{submitting ? "Saving..." : "Done"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: "#ccc", maxWidth: 200 },
  chipSelected: { borderColor: "#333", backgroundColor: "#eee" },
  starter: { fontSize: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 12, minHeight: 60, textAlignVertical: "top" },
  error: { color: "#b00020" },
  submit: { marginTop: 16, backgroundColor: "#333", padding: 14, borderRadius: 12, alignItems: "center" },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontWeight: "600" },
});
