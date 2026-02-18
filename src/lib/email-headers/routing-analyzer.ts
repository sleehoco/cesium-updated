/**
 * Email Routing Analyzer
 * Parses Received headers to trace an email's routing path.
 * Client-side only — pure TypeScript, zero dependencies.
 */

import type { ParsedHeader, RoutingHop, RoutingAnalysis, RoutingFlag } from './types';
import { getHeaders } from './header-parser';

const IPV4_IN_BRACKETS = /\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]/;

function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1]! >= 16 && parts[1]! <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return false;
}

function extractFrom(value: string): string | null {
  const match = value.match(/\bfrom\s+(\S+)/i);
  return match ? match[1]! : null;
}

function extractBy(value: string): string | null {
  const match = value.match(/\bby\s+(\S+)/i);
  return match ? match[1]! : null;
}

function extractIP(value: string): string | null {
  const match = value.match(IPV4_IN_BRACKETS);
  return match ? match[1]! : null;
}

function extractTimestamp(value: string): Date | null {
  const semiIndex = value.lastIndexOf(';');
  if (semiIndex === -1) return null;
  const dateStr = value.substring(semiIndex + 1).trim();
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function containsPrivateIP(value: string | null): boolean {
  if (!value) return false;
  const match = value.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
  return match ? isPrivateIP(match[1]!) : false;
}

export function analyzeRouting(headers: ParsedHeader[]): RoutingAnalysis {
  const receivedValues = getHeaders(headers, 'received');

  // Received headers are in reverse chronological order — reverse for display
  const parsedHops = receivedValues
    .map((value) => ({
      from: extractFrom(value),
      by: extractBy(value),
      ip: extractIP(value),
      timestamp: extractTimestamp(value),
      raw: value,
    }))
    .reverse();

  const hops: RoutingHop[] = [];
  const flags: RoutingFlag[] = [];

  for (let i = 0; i < parsedHops.length; i++) {
    const parsed = parsedHops[i]!;

    let delay: number | null = null;
    if (i > 0) {
      const prev = parsedHops[i - 1]!.timestamp;
      const curr = parsed.timestamp;
      if (prev && curr) delay = curr.getTime() - prev.getTime();
    }

    hops.push({
      index: i + 1,
      from: parsed.from,
      by: parsed.by,
      ip: parsed.ip,
      timestamp: parsed.timestamp,
      delay,
      raw: parsed.raw,
    });

    if (!parsed.from || !parsed.by || !parsed.timestamp) {
      flags.push({
        type: 'missing-info',
        severity: 'low',
        description: `Hop ${i + 1}: Incomplete routing information`,
        explanation:
          'One or more routing headers are incomplete or malformed. This could indicate the email was relayed through a non-standard or misconfigured mail server.',
      });
    }

    if (delay !== null && delay > 30 * 60 * 1000) {
      const delayMinutes = Math.round(delay / (60 * 1000));
      flags.push({
        type: 'excessive-delay',
        severity: 'medium',
        description: `Hop ${i + 1}: ${delayMinutes} minute delay`,
        explanation: `There was a ${delayMinutes} minute delay between two mail servers. While this can happen with legitimate mail during server congestion, it can also indicate the email was held for modification or analysis by an attacker.`,
      });
    }

    if (i > 0) {
      const ipIsPrivate = parsed.ip ? isPrivateIP(parsed.ip) : false;
      if (containsPrivateIP(parsed.from) || containsPrivateIP(parsed.by) || ipIsPrivate) {
        flags.push({
          type: 'suspicious-relay',
          severity: 'medium',
          description: `Hop ${i + 1}: Private IP address in routing`,
          explanation:
            'The email was routed through a private/internal network address at an unexpected point in its journey. This can indicate tampering with routing headers.',
        });
      }
    }
  }

  return { hops, totalHops: hops.length, flags };
}
