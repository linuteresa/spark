import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JSON_HEADERS = { ...CORS_HEADERS, 'content-type': 'application/json' };

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const ENERGY_LABELS: Record<number, string> = { 1: 'low', 2: 'medium', 3: 'high' };

interface CheckInPayload {
  emotion: string;
  energy_level: number;
  pillar: string;
  substressor_code: string;
  context?: string;
}

async function personalize(input: {
  emotion: string;
  pillar: string;
  substressorLabel: string;
  energyLevel: number;
  context?: string;
  actionText: string;
}): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) return null;

  const energyLabel = ENERGY_LABELS[input.energyLevel] ?? 'medium';
  const prompt = `A student just checked in feeling "${input.emotion}" about ${input.substressorLabel.toLowerCase()} (${input.pillar.replace('_', ' ')}), with ${energyLabel} energy.${
    input.context ? ` They added: "${input.context}"` : ''
  }

Their matched task for today is: "${input.actionText}"

Write one short, warm sentence (max 25 words) that acknowledges how they're feeling and frames this exact task as the right next step. Do not invent a different task or restate it verbatim. No emoji, no exclamation points, plain supportive tone.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.[0]?.text?.trim();
    return text || null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  let payload: CheckInPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: rpcData, error: rpcError } = await userClient
    .rpc('submit_check_in_and_assign', {
      p_emotion: payload.emotion,
      p_energy_level: payload.energy_level,
      p_pillar: payload.pillar,
      p_substressor_code: payload.substressor_code,
      p_context: payload.context ?? null,
    })
    .single();

  if (rpcError || !rpcData) {
    return new Response(JSON.stringify({ error: rpcError?.message ?? 'Check-in failed' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const { data: subStressor } = await userClient
    .from('sub_stressors')
    .select('label')
    .eq('code', payload.substressor_code)
    .single();

  const aiNote = await personalize({
    emotion: payload.emotion,
    pillar: payload.pillar,
    substressorLabel: subStressor?.label ?? payload.substressor_code,
    energyLevel: payload.energy_level,
    context: payload.context,
    actionText: rpcData.action_text,
  });

  if (aiNote) {
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await serviceClient.from('challenge_assignment').update({ ai_note: aiNote }).eq('id', rpcData.assignment_id);
  }

  return new Response(
    JSON.stringify({
      assignment_id: rpcData.assignment_id,
      action_text: rpcData.action_text,
      for_date: rpcData.for_date,
      ai_note: aiNote,
    }),
    { headers: JSON_HEADERS }
  );
});
