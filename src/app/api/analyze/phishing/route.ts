import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/completions';
import { SECURITY_PROMPTS } from '@/lib/ai/prompts';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Phishing Detector API
 * Analyzes emails, URLs, and content for phishing indicators
 */

const phishingAnalysisSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  analysisType: z.enum(['email', 'url', 'content']),
  sender: z.string().optional(),
  subject: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // Rate limiting
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
          'Retry-After': Math.ceil(
            (rateLimitResult.reset * 1000 - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { content, analysisType, sender, subject } = phishingAnalysisSchema.parse(body);

    // Build the analysis prompt
    const userMessage = `
Analyze the following for phishing indicators:

**Analysis Type**: ${analysisType}
${sender ? `**Sender**: ${sender}` : ''}
${subject ? `**Subject**: ${subject}` : ''}

**Content**:
\`\`\`
${content}
\`\`\`

Provide a comprehensive phishing analysis including:
1. Phishing risk score (0-100)
2. Clear verdict (Legitimate/Suspicious/Malicious)
3. Identified red flags and phishing indicators
4. Social engineering tactics detected
5. URL and link analysis (if applicable)
6. Sender verification assessment
7. Recommended action
8. User education points
`.trim();

    // Generate AI analysis
    const analysis = await generateCompletion({
      systemPrompt: SECURITY_PROMPTS.PHISHING_ANALYZER,
      userMessage,
      provider: 'groq',
      temperature: 0.2, // Lower temperature for more consistent phishing detection
    });

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        analysisType,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // AI generation error
    if (error instanceof Error && error.message.includes('timed out')) {
      return NextResponse.json(
        {
          error: 'Request timed out. Please try again with shorter content.',
        },
        { status: 504 }
      );
    }

    // Generic error
    console.error('Phishing analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze content. Please try again.',
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
