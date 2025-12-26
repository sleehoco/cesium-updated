import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/completions';
import { SECURITY_PROMPTS } from '@/lib/ai/prompts';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { extractURLs, checkMultipleURLs } from '@/lib/threat-intel/url-checker';
import { requireAuthAPI } from '@/lib/auth/utils';

/**
 * Phishing Detector API
 * Analyzes emails, URLs, and content for phishing indicators
 */

const phishingAnalysisSchema = z.object({
  content: z.string().min(1, 'Content is required').max(50000, 'Content too large (max 50KB)'),
  analysisType: z.enum(['email', 'url', 'content']),
  sender: z.string().max(500).optional(),
  subject: z.string().max(500).optional(),
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
    const { content, analysisType, sender, subject } = phishingAnalysisSchema.parse(body);

    // Extract and check URLs from content
    const urls = extractURLs(content);
    let urlCheckResults = null;

    if (urls.length > 0) {
      // Check URLs against threat intelligence sources
      urlCheckResults = await checkMultipleURLs(urls);
    }

    // Build URL analysis section for the prompt
    let urlAnalysisSection = '';
    if (urlCheckResults && urlCheckResults.length > 0) {
      urlAnalysisSection = '\n\n**URL Threat Intelligence Results**:\n';
      urlCheckResults.forEach((result, index) => {
        urlAnalysisSection += `\nURL ${index + 1}: ${result.url}\n`;
        urlAnalysisSection += `- Reputation: ${result.reputation.toUpperCase()}\n`;
        if (result.sources.virusTotal) {
          const vt = result.sources.virusTotal;
          urlAnalysisSection += `- VirusTotal: ${vt.malicious} malicious, ${vt.suspicious} suspicious, ${vt.clean} clean\n`;
        }
        if (result.findings.length > 0) {
          urlAnalysisSection += `- Findings: ${result.findings.join('; ')}\n`;
        }
      });
    }

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
${urlAnalysisSection}

Provide a comprehensive phishing analysis including:
1. Phishing risk score (0-100)
2. Clear verdict (Legitimate/Suspicious/Malicious)
3. Identified red flags and phishing indicators
4. Social engineering tactics detected
5. URL and link analysis (incorporate the threat intelligence results above)
6. Sender verification assessment
7. Recommended action
8. User education points

${urlCheckResults && urlCheckResults.length > 0 ? 'IMPORTANT: Consider the URL threat intelligence results in your analysis. If any URLs are flagged as malicious or suspicious, increase the phishing risk score accordingly.' : ''}
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
        urlsFound: urls.length,
        urlCheckResults: urlCheckResults || [],
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

// OPTIONS handler removed - CORS not needed for authenticated same-origin requests
