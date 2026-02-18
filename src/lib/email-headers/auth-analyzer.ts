/**
 * Authentication-Results Header Analyzer
 * Parses the Authentication-Results email header to extract SPF, DKIM, and DMARC
 * results and produces a human-readable summary. Runs client-side only.
 */

import type { ParsedHeader, AuthResult, AuthSummary } from './types';
import { getHeader } from './header-parser';

type AuthMethod = 'spf' | 'dkim' | 'dmarc';
type AuthResultValue = 'pass' | 'fail' | 'softfail' | 'neutral' | 'none' | 'temperror' | 'permerror';
type Verdict = 'fully-authenticated' | 'partially-authenticated' | 'failed' | 'no-authentication';

const VALID_RESULTS: AuthResultValue[] = ['pass', 'fail', 'softfail', 'neutral', 'none', 'temperror', 'permerror'];

function extractDomain(segment: string): string | undefined {
  const headerIMatch = segment.match(/header\.i=@?([^\s;]+)/i);
  if (headerIMatch) {
    const v = headerIMatch[1]!;
    const at = v.indexOf('@');
    return at >= 0 ? v.slice(at + 1) : v;
  }
  const headerFromMatch = segment.match(/header\.from=([^\s;]+)/i);
  if (headerFromMatch) {
    const v = headerFromMatch[1]!;
    const at = v.indexOf('@');
    return at >= 0 ? v.slice(at + 1) : v;
  }
  const smtpMatch = segment.match(/smtp\.mailfrom=([^\s;]+)/i);
  if (smtpMatch) {
    const v = smtpMatch[1]!;
    const at = v.indexOf('@');
    return at >= 0 ? v.slice(at + 1) : v;
  }
  return undefined;
}

function getExplanation(method: AuthMethod, result: AuthResultValue): string {
  const explanations: Record<AuthMethod, Record<AuthResultValue, string>> = {
    spf: {
      pass: 'The sending server is authorized to send email for this domain. This is a good sign that the email is legitimate.',
      fail: 'The sending server is NOT authorized to send email for this domain. This email may be spoofed.',
      softfail: 'The sending server is probably not authorized. The domain owner flagged this as suspicious but not strictly forbidden.',
      neutral: 'The domain owner has not stated whether this server is authorized.',
      none: 'No SPF record was found for this domain.',
      temperror: 'A temporary error occurred while checking SPF.',
      permerror: 'A permanent error occurred — the domain may have a misconfigured SPF record.',
    },
    dkim: {
      pass: "The email's digital signature is valid. The content has not been tampered with since it was sent.",
      fail: "The email's digital signature is invalid. The email may have been altered in transit or the signature is forged.",
      softfail: 'The DKIM signature could not be fully verified.',
      neutral: 'DKIM verification returned a neutral result.',
      none: 'No DKIM signature was found on this email.',
      temperror: 'A temporary error occurred while verifying the DKIM signature.',
      permerror: 'A permanent error occurred — the signing domain may have a misconfigured DKIM setup.',
    },
    dmarc: {
      pass: "The email passes the domain owner's authentication policy. Strong evidence the email is legitimate.",
      fail: "The email FAILS the domain owner's authentication policy. This email should not be trusted.",
      softfail: 'The email does not fully meet the DMARC policy.',
      neutral: 'DMARC returned a neutral result.',
      none: 'No DMARC policy was found for this domain.',
      temperror: 'A temporary error occurred while checking the DMARC policy.',
      permerror: 'A permanent error occurred — the domain may have a misconfigured DMARC record.',
    },
  };
  return explanations[method][result];
}

function parseMethodSegment(segment: string): { method: AuthMethod; result: AuthResult } | null {
  const trimmed = segment.trim();
  if (!trimmed) return null;

  const methods: AuthMethod[] = ['dkim', 'spf', 'dmarc'];
  for (const method of methods) {
    const regex = new RegExp(`${method}\\s*=\\s*(\\w+)`, 'i');
    const match = trimmed.match(regex);
    if (match) {
      const rawResult = match[1]!.toLowerCase();
      const resultValue: AuthResultValue = VALID_RESULTS.includes(rawResult as AuthResultValue)
        ? (rawResult as AuthResultValue)
        : 'none';
      return {
        method,
        result: {
          method,
          result: resultValue,
          domain: extractDomain(trimmed),
          explanation: getExplanation(method, resultValue),
        },
      };
    }
  }
  return null;
}

function computeVerdict(spf: AuthResult | null, dkim: AuthResult | null, dmarc: AuthResult | null): Verdict {
  const results = [spf, dkim, dmarc].filter((r): r is AuthResult => r !== null);
  if (results.length === 0) return 'no-authentication';
  if (results.some((r) => r.result === 'fail')) return 'failed';
  if (spf?.result === 'pass' && dkim?.result === 'pass' && dmarc?.result === 'pass') return 'fully-authenticated';
  if (results.some((r) => r.result === 'pass')) return 'partially-authenticated';
  return 'partially-authenticated';
}

const verdictLabels: Record<Verdict, string> = {
  'fully-authenticated': 'Fully Authenticated',
  'partially-authenticated': 'Partially Authenticated',
  failed: 'Authentication Failed',
  'no-authentication': 'No Authentication Data',
};

const verdictColors: Record<Verdict, string> = {
  'fully-authenticated': 'text-green-400',
  'partially-authenticated': 'text-yellow-400',
  failed: 'text-red-400',
  'no-authentication': 'text-gray-400',
};

export function analyzeAuth(headers: ParsedHeader[]): AuthSummary {
  const authHeader = getHeader(headers, 'authentication-results');
  if (!authHeader) {
    return {
      spf: null, dkim: null, dmarc: null,
      verdict: 'no-authentication',
      verdictLabel: verdictLabels['no-authentication'],
      verdictColor: verdictColors['no-authentication'],
    };
  }

  const segments = authHeader.split(';');
  let spf: AuthResult | null = null;
  let dkim: AuthResult | null = null;
  let dmarc: AuthResult | null = null;

  for (const segment of segments) {
    const parsed = parseMethodSegment(segment);
    if (!parsed) continue;
    if (parsed.method === 'spf' && !spf) spf = parsed.result;
    if (parsed.method === 'dkim' && !dkim) dkim = parsed.result;
    if (parsed.method === 'dmarc' && !dmarc) dmarc = parsed.result;
  }

  const verdict = computeVerdict(spf, dkim, dmarc);
  return {
    spf, dkim, dmarc, verdict,
    verdictLabel: verdictLabels[verdict],
    verdictColor: verdictColors[verdict],
  };
}
