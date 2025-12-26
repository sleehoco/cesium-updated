/**
 * Threat Intelligence Analysis API
 * POST /api/analyze/threat
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/completions';
import { getSecurityPrompt } from '@/lib/ai/prompts';
import { analyzeIOC, summarizeVTResults, hasVirusTotalKey } from '@/lib/threat-intel/virustotal';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const requestSchema = z.object({
  ioc: z.string().min(1).max(1000).describe('Indicator of Compromise to analyze'),
  provider: z.enum(['groq', 'together', 'openai']).optional(),
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
    const { ioc, provider } = requestSchema.parse(body);

    // Step 1: Get VirusTotal data (if API key available)
    const vtResult = hasVirusTotalKey() ? await analyzeIOC(ioc) : null;
    const vtSummary = vtResult?.vtData ? summarizeVTResults(vtResult.type, vtResult.vtData) : '';

    // Step 2: Build AI prompt with VirusTotal context
    let userMessage = `Analyze this Indicator of Compromise (IOC): ${ioc}`;

    if (vtSummary) {
      userMessage += `\n\nVirusTotal scan results:\n${vtSummary}`;
      userMessage += `\n\nProvide additional context, explain what this IOC represents, known threat actors or campaigns, and recommend actions. Use the VirusTotal data as ground truth.`;
    } else {
      userMessage += `\n\nNote: VirusTotal API not available. Provide analysis based on general threat intelligence knowledge.`;
    }

    // Step 3: Generate AI analysis
    const result = await generateCompletion({
      systemPrompt: getSecurityPrompt('THREAT_INTELLIGENCE'),
      userMessage,
      provider,
      temperature: 0.1, // Low temperature for factual analysis
    });

    // Step 4: Combine results
    return NextResponse.json({
      success: true,
      data: {
        ioc,
        analysis: result.content,
        virusTotalData: vtResult?.vtData ? {
          type: vtResult.type,
          stats: vtResult.vtData.data.attributes.last_analysis_stats,
          summary: vtSummary,
        } : null,
        provider: result.provider,
        model: result.model,
        usage: result.usage,
      },
    });
  } catch (error) {
    console.error('Threat analysis error:', error);

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
