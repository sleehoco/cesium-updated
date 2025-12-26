import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/completions';
import { SECURITY_PROMPTS } from '@/lib/ai/prompts';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Incident Response API
 * Provides AI-powered incident response guidance and playbooks
 */

const incidentResponseSchema = z.object({
  incidentDescription: z.string().min(1, 'Incident description is required').max(10000, 'Description too large'),
  incidentType: z.enum([
    'malware',
    'ransomware',
    'data_breach',
    'phishing',
    'ddos',
    'unauthorized_access',
    'insider_threat',
    'general',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  affectedSystems: z.string().max(2000, 'Affected systems list too large').optional(),
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
    const { incidentDescription, incidentType, severity, affectedSystems } =
      incidentResponseSchema.parse(body);

    // Build the analysis prompt
    const userMessage = `
Provide incident response guidance for the following security incident:

**Incident Type**: ${incidentType}
${severity ? `**Severity**: ${severity}` : ''}
${affectedSystems ? `**Affected Systems**: ${affectedSystems}` : ''}

**Incident Description**:
${incidentDescription}

Provide a comprehensive incident response plan including:
1. Incident classification and severity assessment
2. Immediate actions (first 30 minutes)
3. Containment strategy (detailed steps)
4. Investigation procedures and forensic steps
5. Evidence collection requirements
6. Communication plan (who to notify and when)
7. Recovery steps and system restoration
8. Post-incident activities and lessons learned
9. Preventive measures for the future

Format the response as a structured incident response playbook that can be followed step-by-step.
`.trim();

    // Generate AI analysis
    const analysis = await generateCompletion({
      systemPrompt: SECURITY_PROMPTS.INCIDENT_RESPONSE,
      userMessage,
      provider: 'groq',
      temperature: 0.3,
    });

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        incidentType,
        severity,
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
          error: 'Request timed out. Please try again.',
        },
        { status: 504 }
      );
    }

    // Generic error
    console.error('Incident response error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate incident response plan. Please try again.',
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler removed - CORS not needed for authenticated same-origin requests
