import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { generateCompletion } from '@/lib/ai/completions';
import { SECURITY_PROMPTS } from '@/lib/ai/prompts';
import { requireAuthAPI } from '@/lib/auth/utils';
import { sanitizePromptInput } from '@/lib/ai/sanitize';

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      })
    )
    .optional(),
  scenario: z
    .object({
      title: z.string(),
      industry: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  inject: z
    .object({
      label: z.string(),
      detail: z.string(),
    })
    .optional(),
  gameState: z
    .object({
      intrusionScore: z.number(),
      shieldLevel: z.number(),
      phase: z.string(),
    })
    .optional(),
});

function buildTranscript(history: { role: 'user' | 'assistant'; content: string }[] = []) {
  if (history.length === 0) {
    return '';
  }
  return history
    .map((entry) => `${entry.role === 'user' ? 'ANALYST' : 'WOPR'}: ${entry.content}`)
    .join('\n');
}

export async function POST(req: NextRequest) {
  const rateLimitResult = rateLimit(req, RATE_LIMITS.AI_ENDPOINT);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  }

  // Require authentication
  const authResult = await requireAuthAPI();
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await req.json();
    const parsed = chatSchema.parse(body);

    // SECURITY: Sanitize user message to prevent prompt injection
    const sanitizedMessage = sanitizePromptInput(parsed.message);

    const scenarioContext = parsed.scenario
      ? `SCENARIO: ${parsed.scenario.title.toUpperCase()} (${parsed.scenario.industry ?? 'SECTOR'}). ${parsed.scenario.description ?? ''}`
      : '';
    const injectContext = parsed.inject
      ? `INTEL ${parsed.inject.label.toUpperCase()}: ${parsed.inject.detail}`
      : '';
    const gameStateContext = parsed.gameState
      ? `CURRENT STATUS: INTRUSION SCORE: ${parsed.gameState.intrusionScore}%, SHIELD LEVEL: ${parsed.gameState.shieldLevel}%, PHASE: ${parsed.gameState.phase.toUpperCase()}`
      : '';

    const transcript = buildTranscript(parsed.history);

    const payload = [
      scenarioContext,
      injectContext,
      gameStateContext,
      transcript,
      `ANALYST: ${sanitizedMessage}`,
      'WOPR:',
    ]
      .filter(Boolean)
      .join('\n\n');

    const completion = await generateCompletion({
      systemPrompt: SECURITY_PROMPTS.WARGAMES_CONSOLE,
      userMessage: payload,
      temperature: 0.2,
      maxTokens: 800,
    });

    let aiData;
    try {
      // Try to find JSON in the response
      const jsonMatch = completion.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (e) {
      console.warn('Failed to parse AI JSON response, falling back to raw text', e);
      aiData = {
        response: completion.content,
        intrusionScoreDelta: 0,
        shieldLevelDelta: 0,
        alertResolved: false,
      };
    }

    return NextResponse.json({
      response: aiData.response,
      intrusionScoreDelta: aiData.intrusionScoreDelta || 0,
      shieldLevelDelta: aiData.shieldLevelDelta || 0,
      alertResolved: aiData.alertResolved || false,
      provider: completion.provider,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('WarGames chat failure:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
