import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/completions';
import { SECURITY_PROMPTS } from '@/lib/ai/prompts';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Security Log Analyzer API
 * Analyzes security logs for threats, anomalies, and suspicious patterns
 */

const logAnalysisSchema = z.object({
  logs: z.string().min(1, 'Logs are required'),
  logSource: z.string().optional(),
  focusArea: z.enum(['all', 'authentication', 'network', 'application', 'system']).default('all'),
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
    const { logs, logSource, focusArea } = logAnalysisSchema.parse(body);

    // Build the analysis prompt
    const userPrompt = `
Analyze the following security logs:

${logSource ? `**Log Source**: ${logSource}` : ''}
${focusArea !== 'all' ? `**Focus Area**: ${focusArea}` : ''}

**Logs**:
\`\`\`
${logs}
\`\`\`

Provide a comprehensive security log analysis including:
1. Log source identification and format
2. Key security findings (prioritized by severity)
3. Timeline of events (if applicable)
4. Attack patterns or anomalies detected
5. Impact assessment
6. Recommended immediate actions
7. Long-term security improvements

Focus on actionable intelligence and clear explanations.
`.trim();

    // Generate AI analysis
    const analysis = await generateCompletion({
      systemPrompt: SECURITY_PROMPTS.LOG_ANALYZER,
      userPrompt,
      provider: 'groq',
      temperature: 0.3,
    });

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        logSource,
        focusArea,
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
          error: 'Request timed out. Please try again with fewer logs.',
        },
        { status: 504 }
      );
    }

    // Generic error
    console.error('Log analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze logs. Please try again.',
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
