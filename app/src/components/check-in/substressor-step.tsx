import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import type { Pillar, SubStressor } from '@/lib/types';

interface SubstressorStepProps {
  pillar: Pillar;
  value: string | null;
  onChange: (code: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

export function SubstressorStep({
  pillar,
  value,
  onChange,
  onSubmit,
  onBack,
  submitting,
}: SubstressorStepProps) {
  const [options, setOptions] = useState<SubStressor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('sub_stressors')
      .select('*')
      .eq('pillar', pillar)
      .order('sort_order')
      .then(({ data }) => {
        setOptions((data as SubStressor[]) ?? []);
        setLoading(false);
      });
  }, [pillar]);

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.heading}>
        What specifically is on your mind?
      </ThemedText>

      {loading && <ActivityIndicator />}

      <View style={styles.list}>
        {options.map((option) => (
          <Pressable
            key={option.code}
            onPress={() => onChange(option.code)}
            style={[styles.row, value === option.code ? styles.rowSelected : styles.rowIdle]}>
            <ThemedText type="default">{option.label}</ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Back" onPress={onBack} variant="outline" style={styles.flexButton} />
        <Button
          label={submitting ? 'Saving…' : "That's it"}
          onPress={onSubmit}
          disabled={!value || submitting}
          loading={submitting}
          style={styles.flexButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  heading: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
  row: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    borderWidth: 2,
  },
  rowIdle: {
    backgroundColor: '#F5F6F8',
    borderColor: 'transparent',
  },
  rowSelected: {
    backgroundColor: '#EAF1FE',
    borderColor: '#5B8DEF',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  flexButton: {
    flex: 1,
  },
});
