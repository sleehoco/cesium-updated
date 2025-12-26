/**
 * Rate Limiting Middleware
 * Simple in-memory rate limiting for API routes
 *
 * For production, consider using:
 * - Upstash Rate Limit (Redis-based, serverless-friendly)
 * - Vercel Edge Config
 * - External rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (resets on server restart)
// For production, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number;
  /**
   * Time window in seconds
   */
  windowSeconds: number;
  /**
   * Custom identifier (defaults to IP address)
   */
  identifier?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `${identifier}:${config.limit}:${config.windowSeconds}`;

  let entry = rateLimitStore.get(key);

  // Create new entry if doesn't exist or expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment count
  entry.count++;

  const remaining = Math.max(0, config.limit - entry.count);
  const success = entry.count <= config.limit;

  return {
    success,
    limit: config.limit,
    remaining,
    reset: Math.floor(entry.resetTime / 1000),
  };
}

/**
 * Get client identifier from Next.js request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  // Use the first available identifier
  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown';

  return ip.trim();
}

/**
 * Rate limit middleware for API routes
 *
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   const rateLimitResult = rateLimit(request, { limit: 10, windowSeconds: 60 });
 *
 *   if (!rateLimitResult.success) {
 *     return new Response(
 *       JSON.stringify({ error: 'Too many requests' }),
 *       {
 *         status: 429,
 *         headers: {
 *           'Content-Type': 'application/json',
 *           'X-RateLimit-Limit': rateLimitResult.limit.toString(),
 *           'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
 *           'X-RateLimit-Reset': rateLimitResult.reset.toString(),
 *           'Retry-After': ((rateLimitResult.reset * 1000 - Date.now()) / 1000).toString(),
 *         },
 *       }
 *     );
 *   }
 *
 *   // Continue with request handling
 * }
 * ```
 */
export function rateLimit(
  request: Request,
  config: RateLimitConfig
): RateLimitResult {
  const identifier = config.identifier || getClientIdentifier(request);
  return checkRateLimit(identifier, config);
}

/**
 * Preset rate limit configurations
 */
export const RATE_LIMITS = {
  // Generous limit for authenticated users
  STANDARD: { limit: 100, windowSeconds: 60 }, // 100 req/min

  // Strict limit for AI endpoints (expensive)
  AI_ENDPOINT: { limit: 10, windowSeconds: 60 }, // 10 req/min

  // Very strict for unauthenticated contact forms
  CONTACT_FORM: { limit: 3, windowSeconds: 300 }, // 3 req/5min

  // Moderate for general API usage
  API_DEFAULT: { limit: 30, windowSeconds: 60 }, // 30 req/min
} as const;
