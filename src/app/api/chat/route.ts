/**
 * Security Robot Chat API
 * POST /api/chat
 * Streaming chat endpoint powered by xAI (Grok)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';
import { xai, XAI_MODEL } from '@/lib/ai/xai-provider';
import { ROBOT_PROMPTS, type RobotMode } from '@/lib/ai/robot-prompts';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const requestSchema = z.object({
  messages: z.array(z.any()),
  mode: z.enum(['security-quiz', 'tool-walkthrough', 'freeform']).default('freeform'),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 30 requests per minute per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`chat:${ip}`, 30, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Origin check
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';
    const allowedOrigin = new URL(appUrl).origin;

    if (origin && origin !== allowedOrigin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!origin && referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        if (refererOrigin !== allowedOrigin) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await req.json();
    const { messages, mode } = requestSchema.parse(body);

    const temperature = mode === 'freeform' ? 0.7 : 0.3;

    // Convert UIMessage format to model messages
    const modelMessages = await convertToModelMessages(messages as UIMessage[]);

    const result = streamText({
      model: xai(XAI_MODEL),
      system: ROBOT_PROMPTS[mode as RobotMode],
      messages: modelMessages,
      temperature,
      maxOutputTokens: 1024,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
