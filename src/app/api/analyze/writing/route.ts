import { NextRequest } from 'next/server';
import { createStreamingTextResponse } from '@/lib/ai/stream';
import { getBestProvider } from '@/lib/ai/providers';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface WritingRequest {
  text: string;
  mode: 'review' | 'compose-email' | 'formalize';
  systemPrompt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as WritingRequest;
    const { text, mode, systemPrompt } = body;

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the best available AI provider
    const provider = getBestProvider();

    // Build the system message based on mode
    let systemMessage = systemPrompt || '';

    if (!systemMessage) {
      switch (mode) {
        case 'review':
          systemMessage = `You are a professional writing assistant specializing in grammar, spelling, and style corrections.
Review the provided text and:
1. Identify and correct any grammar, spelling, or punctuation errors
2. Suggest improvements for clarity and readability
3. Maintain the original tone and intent
4. Provide explanations for significant changes

Format your response clearly with the corrected text and explanations.`;
          break;

        case 'compose-email':
          systemMessage = `You are a professional business communication expert.
Based on the user's request, compose a professional business email that:
1. Uses appropriate business tone and language
2. Has a clear subject line
3. Includes proper greeting and closing
4. Is concise and well-structured
5. Maintains professional etiquette

Format the email with Subject, Body, and appropriate signature placeholder.`;
          break;

        case 'formalize':
          systemMessage = `You are an expert in professional business writing.
Transform the provided text into formal, professional business language that:
1. Uses appropriate business terminology
2. Maintains a professional, respectful tone
3. Is clear and concise
4. Follows business writing conventions
5. Removes casual language while preserving meaning

Provide the formalized version with brief notes on major changes if needed.`;
          break;

        default:
          systemMessage = 'You are a helpful writing assistant.';
      }
    }

    const fullPrompt = systemMessage + '\n\n' + text;

    // Create streaming response
    const stream = await createStreamingTextResponse({
      prompt: fullPrompt,
      provider,
      systemMessage: 'You are a professional writing assistant helping users improve their business communications.',
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Writing analysis error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to analyze text',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
