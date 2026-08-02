import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { supabase } from "../lib/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "CheckIn">;

// Matches the check_in.emotion check constraint in
// supabase/migrations/0003_checkins.sql -- keep these in sync.
const EMOTIONS = ["joyful", "calm", "anxious", "sad", "overwhelmed"] as const;
const INTENSITIES = [1, 2, 3, 4, 5] as const;

export function CheckInWheelScreen({ navigation }: Props) {
  const [emotion, setEmotion] = useState<(typeof EMOTIONS)[number] | null>(null);
  const [intensity, setIntensity] = useState<(typeof INTENSITIES)[number] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!emotion || !intensity) return;
    setSubmitting(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setError("Not signed in.");
      setSubmitting(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("check_in")
      .insert({ user_id: userId, emotion, intensity })
      .select("id")
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      // Per the architecture doc: a failed write is queued and retried
      // rather than lost. This scaffold surfaces the error inline instead;
      // wire up an offline queue (e.g. via a local outbox table) before ship.
      setError(insertError?.message ?? "Could not save check-in.");
      return;
    }

    navigation.navigate("YourOptions", { checkInId: data.id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling right now?</Text>
      <View style={styles.row}>
        {EMOTIONS.map((e) => (
          <Pressable
            key={e}
            onPress={() => setEmotion(e)}
            style={[styles.chip, emotion === e && styles.chipSelected]}
          >
            <Text>{e}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.subtitle}>How strongly?</Text>
      <View style={styles.row}>
        {INTENSITIES.map((i) => (
          <Pressable
            key={i}
            onPress={() => setIntensity(i)}
            style={[styles.chip, intensity === i && styles.chipSelected]}
          >
            <Text>{i}</Text>
          </Pressable>
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable
        disabled={!emotion || !intensity || submitting}
        onPress={submit}
        style={[styles.submit, (!emotion || !intensity || submitting) && styles.submitDisabled]}
      >
        <Text style={styles.submitText}>{submitting ? "Checking in..." : "Check in"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 16 },
  title: { fontSize: 20, fontWeight: "600" },
  subtitle: { fontSize: 16, marginTop: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: "#ccc" },
  chipSelected: { borderColor: "#333", backgroundColor: "#eee" },
  error: { color: "#b00020" },
  submit: { marginTop: 16, backgroundColor: "#333", padding: 14, borderRadius: 12, alignItems: "center" },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontWeight: "600" },
});
