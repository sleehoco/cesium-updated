/**
 * Threat Intelligence Analysis API
 * POST /api/analyze/threat
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/completions';
import { getSecurityPrompt } from '@/lib/ai/prompts';
import { analyzeIOC, summarizeVTResults, hasVirusTotalKey } from '@/lib/threat-intel/virustotal';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const requestSchema = z.object({
  ioc: z.string().min(1).max(1000).describe('Indicator of Compromise to analyze'),
  provider: z.enum(['groq', 'together', 'openai']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`threat:${ip}`, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Origin check: only allow requests from our own domain
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';
    const allowedOrigin = new URL(appUrl).origin;

    if (origin && origin !== allowedOrigin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    if (!origin && referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        if (refererOrigin !== allowedOrigin) {
          return NextResponse.json(
            { success: false, error: 'Forbidden' },
            { status: 403 }
          );
        }
      } catch {
        // Invalid referer URL, reject
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }
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
