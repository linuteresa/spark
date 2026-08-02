import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";

type StreakState = { current: number; longest: number; totalPoints: number };

// Closes the loop: visible progress from the check-in the student just
// completed. Points balance is always sum(points_ledger.amount), computed
// here rather than trusted from a cached counter.
export function StreakScreen() {
  const [state, setState] = useState<StreakState | null>(null);
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

      const [{ data: streak, error: streakError }, { data: pointsRows, error: pointsError }] =
        await Promise.all([
          supabase.from("streak").select("current_count, longest").eq("user_id", userId).maybeSingle(),
          supabase.from("points_ledger").select("amount").eq("user_id", userId),
        ]);

      if (cancelled) return;
      if (streakError || pointsError) {
        setError(streakError?.message ?? pointsError?.message ?? "Could not load progress.");
        return;
      }

      const totalPoints = (pointsRows ?? []).reduce((sum, row) => sum + row.amount, 0);
      setState({ current: streak?.current_count ?? 0, longest: streak?.longest ?? 0, totalPoints });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!state) return <ActivityIndicator style={styles.container} />;

  return (
    <View style={styles.container}>
      <Text style={styles.big}>{state.current}</Text>
      <Text style={styles.label}>day streak (longest: {state.longest})</Text>
      <Text style={[styles.big, styles.pointsSpacing]}>{state.totalPoints}</Text>
      <Text style={styles.label}>points</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  big: { fontSize: 48, fontWeight: "700" },
  pointsSpacing: { marginTop: 32 },
  label: { fontSize: 14, color: "#666" },
  error: { color: "#b00020", padding: 24 },
});
