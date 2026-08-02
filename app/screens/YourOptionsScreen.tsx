import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { supabase } from "../lib/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "YourOptions">;

type ChallengeKind = "solo_reset" | "irl_challenge" | "community_moment";

type OptionRow = {
  id: string;
  rank: number;
  reason: string | null;
  challenges: {
    kind: ChallengeKind;
    title: string;
    duration_minutes: number;
  } | null;
};

const KIND_LABEL: Record<ChallengeKind, string> = {
  solo_reset: "Solo Reset",
  irl_challenge: "IRL Challenge",
  community_moment: "Community Moment",
};

// Confirmed team direction: always show all three options, ranked, with the
// top-ranked one highlighted -- never hide or gate one behind another. See
// docs/screen-data-contract.md.
export function YourOptionsScreen({ navigation }: Props) {
  const [options, setOptions] = useState<OptionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) {
        setError("Not signed in.");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const { data, error: fetchError } = await supabase
        .from("challenge_assignment")
        .select("id, rank, reason, challenges(kind, title, duration_minutes)")
        .eq("user_id", userId)
        .eq("for_date", today)
        .order("rank", { ascending: true });

      if (cancelled) return;
      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      setOptions((data ?? []) as unknown as OptionRow[]);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!options) return <ActivityIndicator style={styles.container} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your options</Text>
      {options.length === 0 && (
        <Text>
          No options assigned yet for today -- the nightly recommendation job populates this list.
          See supabase/functions/recommend-nightly.
        </Text>
      )}
      {options.map((opt) => (
        <Pressable
          key={opt.id}
          onPress={() => navigation.navigate("DailyChallenge", { assignmentId: opt.id })}
          style={[styles.card, opt.rank === 1 && styles.cardTop]}
        >
          <Text style={styles.kind}>{opt.challenges ? KIND_LABEL[opt.challenges.kind] : ""}</Text>
          <Text style={styles.cardTitle}>{opt.challenges?.title}</Text>
          <Text style={styles.meta}>{opt.challenges?.duration_minutes} min</Text>
          {opt.reason && <Text style={styles.reason}>{opt.reason}</Text>}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 16 },
  cardTop: { borderColor: "#333", borderWidth: 2 },
  kind: { fontSize: 12, textTransform: "uppercase", color: "#666" },
  cardTitle: { fontSize: 16, fontWeight: "600", marginTop: 4 },
  meta: { color: "#666", marginTop: 2 },
  reason: { marginTop: 6, fontStyle: "italic", color: "#444" },
  error: { color: "#b00020", padding: 24 },
});
