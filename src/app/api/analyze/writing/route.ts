import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/completions';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  text: z.string().min(1).max(10000),
  mode: z.enum(['review', 'compose-email', 'formalize']),
});

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(req, RATE_LIMITS.AI_ENDPOINT);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000).toString(),
          },
        }
      );
    }


    const body = await req.json();
    const { text, mode } = requestSchema.parse(body);

    // Build the system message based on mode
    let systemMessage = '';
    let userMessage = '';

    switch (mode) {
      case 'review':
        systemMessage = `You are a professional writing assistant specializing in grammar, spelling, and style corrections.
Review the provided text and:
1. Identify and correct any grammar, spelling, or punctuation errors
2. Suggest improvements for clarity and readability
3. Maintain the original tone and intent
4. Provide explanations for significant changes

Format your response clearly with the corrected text and explanations.`;
        userMessage = `Please review the following text for grammar, spelling, punctuation, and clarity:\n\n${text}`;
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
        userMessage = `Write a professional business email based on this request:\n\n${text}`;
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
        userMessage = `Please rewrite the following text in a professional, formal business tone:\n\n${text}`;
        break;

      default:
        throw new Error('Invalid mode');
    }

    // Generate AI analysis
    const result = await generateCompletion({
      systemPrompt: systemMessage,
      userMessage,
      temperature: 0.3,
    });

    // Return the result
    return NextResponse.json({
      success: true,
      data: {
        text,
        mode,
        result: result.content,
        provider: result.provider,
        model: result.model,
      },
    });
  } catch (error) {
    console.error('Writing analysis error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
