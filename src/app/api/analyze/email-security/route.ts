/**
 * Email Security Analysis API
 * POST /api/analyze/email-security
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkEmailSecurity } from '@/lib/email-security/dns-checker';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const domainRegex =
  /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const requestSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .max(253, 'Domain too long')
    .regex(domainRegex, 'Invalid domain format'),
});

/**
 * Check if a domain is internal/blocked.
 */
function isBlockedDomain(domain: string): boolean {
  const lower = domain.toLowerCase();

  // Block localhost
  if (lower === 'localhost') return true;

  // Block .local and .internal TLDs
  if (lower.endsWith('.local') || lower.endsWith('.internal')) return true;

  // Block IP addresses (v4)
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(lower)) return true;

  // Block loopback
  if (lower === '127.0.0.1') return true;

  // Block IP-like domains (e.g., "192.168.1.1")
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(lower)) return true;

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`email-security:${ip}`, 10, 60 * 1000);
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
    const { domain } = requestSchema.parse(body);

    // Block internal/private domains
    if (isBlockedDomain(domain)) {
      return NextResponse.json(
        { success: false, error: 'Cannot check internal or private domains' },
        { status: 400 }
      );
    }

    // Run the email security check
    const result = await checkEmailSecurity(domain);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Email security check error:', error);

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
