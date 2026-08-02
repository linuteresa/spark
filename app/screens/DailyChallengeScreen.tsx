import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { supabase } from "../lib/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "DailyChallenge">;

type AssignmentDetail = {
  id: string;
  challenges: { title: string; description: string; duration_minutes: number; needs_buddy: boolean } | null;
};

// Wave 1's "primary path, built first and fully wired" (see the MVP screen
// sequence table in the architecture doc). Solo Reset and Community Moment
// get their own detail screens in Wave 2; for now any option routes here.
export function DailyChallengeScreen({ route, navigation }: Props) {
  const { assignmentId } = route.params;
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error: fetchError } = await supabase
        .from("challenge_assignment")
        .select("id, challenges(title, description, duration_minutes, needs_buddy)")
        .eq("id", assignmentId)
        .single();

      if (cancelled) return;
      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      setAssignment(data as unknown as AssignmentDetail);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [assignmentId]);

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!assignment) return <ActivityIndicator style={styles.container} />;

  const challenge = assignment.challenges;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{challenge?.title}</Text>
      <Text style={styles.description}>{challenge?.description}</Text>
      <Text style={styles.meta}>{challenge?.duration_minutes} min</Text>
      {challenge?.needs_buddy && <Text style={styles.meta}>Better with someone else</Text>}
      <Pressable
        style={styles.submit}
        onPress={() => navigation.navigate("CompleteReflect", { assignmentId })}
      >
        <Text style={styles.submitText}>I did this</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "600" },
  description: { fontSize: 16, color: "#333" },
  meta: { color: "#666" },
  submit: { marginTop: 24, backgroundColor: "#333", padding: 14, borderRadius: 12, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "600" },
  error: { color: "#b00020", padding: 24 },
});
