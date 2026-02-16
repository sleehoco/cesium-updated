/**
 * Security Headers Scanner API
 * POST /api/analyze/headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeHeaders } from '@/lib/security-headers/header-checker';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const requestSchema = z.object({
  url: z
    .string()
    .min(1)
    .refine(
      (val) => val.startsWith('http://') || val.startsWith('https://'),
      'URL must start with http:// or https://'
    )
    .refine((val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, 'Invalid URL format'),
});

function isPrivateUrl(urlString: string): boolean {
  const parsed = new URL(urlString);
  const hostname = parsed.hostname.toLowerCase();

  // Block localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;

  // Block private IP ranges
  const parts = hostname.split('.').map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p))) {
    if (parts[0] === 10) return true; // 10.x.x.x
    if (parts[0] === 172 && parts[1]! >= 16 && parts[1]! <= 31) return true; // 172.16-31.x.x
    if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.x.x
    if (parts[0] === 0) return true; // 0.x.x.x
    if (parts[0] === 169 && parts[1] === 254) return true; // link-local
  }

  // Block .local, .internal domains
  if (hostname.endsWith('.local') || hostname.endsWith('.internal')) return true;

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`headers:${ip}`, 5, 60 * 1000);
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
    const { url } = requestSchema.parse(body);

    // Block internal/private URLs (SSRF protection)
    if (isPrivateUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Cannot scan internal or private URLs' },
        { status: 400 }
      );
    }

    // Fetch the URL with a HEAD request and 10 second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'CesiumCyber-SecurityScanner/1.0' },
      });
    } finally {
      clearTimeout(timeout);
    }

    // Convert response headers to a flat Record<string, string> with lowercase keys
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key.toLowerCase()] = value;
    });

    // Analyze the headers
    const result = analyzeHeaders(url, responseHeaders);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Header scan error:', error);

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

    // Handle fetch-specific errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'Request timed out' },
          { status: 504 }
        );
      }
      if (error instanceof TypeError) {
        return NextResponse.json(
          { success: false, error: 'Could not connect to URL' },
          { status: 502 }
        );
      }
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
