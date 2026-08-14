import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { EnergyStep } from '@/components/check-in/energy-step';
import { MoodStep } from '@/components/check-in/mood-step';
import { PillarStep } from '@/components/check-in/pillar-step';
import { SubstressorStep } from '@/components/check-in/substressor-step';
import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import type { Emotion, EnergyLevel, Pillar } from '@/lib/types';

type Step = 'mood' | 'energy' | 'pillar' | 'substressor';

export default function CheckInScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('mood');
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(null);
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [substressorCode, setSubstressorCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!emotion || !energyLevel || !pillar || !substressorCode) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: fnError } = await supabase.functions.invoke('checkin-ai-note', {
        body: {
          emotion,
          energy_level: energyLevel,
          pillar,
          substressor_code: substressorCode,
        },
      });
      if (fnError) throw fnError;

      setStep('mood');
      setEmotion(null);
      setEnergyLevel(null);
      setPillar(null);
      setSubstressorCode(null);
      router.push('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      {step === 'mood' && (
        <MoodStep value={emotion} onChange={setEmotion} onNext={() => setStep('energy')} />
      )}
      {step === 'energy' && (
        <EnergyStep
          value={energyLevel}
          onChange={setEnergyLevel}
          onNext={() => setStep('pillar')}
          onBack={() => setStep('mood')}
        />
      )}
      {step === 'pillar' && (
        <PillarStep
          value={pillar}
          onChange={setPillar}
          onNext={() => setStep('substressor')}
          onBack={() => setStep('energy')}
        />
      )}
      {step === 'substressor' && pillar && (
        <SubstressorStep
          pillar={pillar}
          value={substressorCode}
          onChange={setSubstressorCode}
          onSubmit={submit}
          onBack={() => setStep('pillar')}
          submitting={submitting}
        />
      )}
      {error && (
        <ThemedText style={styles.error}>{error}</ThemedText>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  error: {
    color: '#cf222e',
    marginTop: Spacing.two,
  },
});
