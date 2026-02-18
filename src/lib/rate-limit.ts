/**
 * Simple in-memory sliding window rate limiter.
 * No external dependencies needed.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory growth
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  cleanup(windowMs);

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining: maxRequests - entry.timestamps.length };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return '127.0.0.1';
}

// Presets used by main-branch API routes
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMITS = {
  AI_ENDPOINT: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
  CONTACT_FORM: { maxRequests: 5, windowMs: 60_000 } as RateLimitConfig,
};

/**
 * Overload: accept a Request + config object (used by main-branch API routes).
 * Returns { success, limit, remaining, reset } for backward compatibility.
 */
export function rateLimitByRequest(
  req: Request,
  config: RateLimitConfig
): { success: boolean; limit: number; remaining: number; reset: number } {
  const ip = getClientIp(req);
  const url = new URL(req.url);
  const key = `${ip}:${url.pathname}`;
  const result = rateLimit(key, config.maxRequests, config.windowMs);
  return {
    success: result.allowed,
    limit: config.maxRequests,
    remaining: result.remaining,
    reset: Math.floor((Date.now() + config.windowMs) / 1000),
  };
}
