import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { SelectableOption } from '@/components/check-in/selectable-option';
import { StepActions } from '@/components/check-in/step-actions';
import { ThemedText } from '@/components/themed-text';
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
          <SelectableOption
            key={option.code}
            label={option.label}
            selected={value === option.code}
            onPress={() => onChange(option.code)}
          />
        ))}
      </View>

      <StepActions
        onBack={onBack}
        onNext={onSubmit}
        nextLabel={submitting ? 'Saving…' : "That's it"}
        nextDisabled={!value || submitting}
        nextLoading={submitting}
      />
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
});
