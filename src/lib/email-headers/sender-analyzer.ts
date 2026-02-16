/**
 * Sender Identity Analyzer
 * Checks for sender identity mismatches in email headers.
 * Client-side only — pure TypeScript, zero dependencies.
 */

import type { ParsedHeader, SenderIdentity, SenderMismatch } from './types';
import { getHeader, parseEmailAddress } from './header-parser';

const BRAND_DOMAINS: Record<string, string> = {
  microsoft: 'microsoft.com',
  google: 'google.com',
  apple: 'apple.com',
  amazon: 'amazon.com',
  paypal: 'paypal.com',
  netflix: 'netflix.com',
  facebook: 'facebook.com',
  linkedin: 'linkedin.com',
  dropbox: 'dropbox.com',
  docusign: 'docusign.com',
  adobe: 'adobe.com',
  chase: 'chase.com',
  wellsfargo: 'wellsfargo.com',
  bankofamerica: 'bankofamerica.com',
};

const FREE_EMAIL_PROVIDERS = new Set(['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com']);
const ORG_KEYWORDS = /\b(inc|llc|corp|ltd|bank|group|foundation|association|university|college)\b/i;

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const row: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(row[j]! + 1, prev + 1, row[j - 1]! + cost);
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length]!;
}

function applySubstitutions(domain: string): string {
  return domain.replace(/rn/g, 'm').replace(/1/g, 'l').replace(/0/g, 'o');
}

function domainLabel(domain: string): string {
  const dotIndex = domain.indexOf('.');
  return dotIndex === -1 ? domain : domain.slice(0, dotIndex);
}

export function analyzeSender(headers: ParsedHeader[]): SenderIdentity {
  const fromRaw = getHeader(headers, 'From');
  const replyToRaw = getHeader(headers, 'Reply-To');
  const returnPathRaw = getHeader(headers, 'Return-Path');

  const fromParsed = fromRaw ? parseEmailAddress(fromRaw) : null;
  const from = fromParsed
    ? { name: fromParsed.name, email: fromParsed.email, domain: fromParsed.domain }
    : null;

  const replyToParsed = replyToRaw ? parseEmailAddress(replyToRaw) : null;
  const replyTo = replyToParsed
    ? { name: replyToParsed.name, email: replyToParsed.email, domain: replyToParsed.domain }
    : null;

  const returnPathParsed = returnPathRaw ? parseEmailAddress(returnPathRaw) : null;
  const returnPath = returnPathParsed
    ? { email: returnPathParsed.email, domain: returnPathParsed.domain }
    : null;

  const mismatches: SenderMismatch[] = [];

  // Reply-To mismatch
  if (from && replyTo && replyTo.domain.toLowerCase() !== from.domain.toLowerCase()) {
    mismatches.push({
      type: 'reply-to-mismatch',
      severity: 'high',
      description: `Reply-To domain (${replyTo.domain}) differs from From domain (${from.domain})`,
      explanation:
        'The sender wants replies to go to a different domain than where this email appears to come from. This is a common phishing technique \u2014 attackers impersonate a trusted sender but redirect your response to an account they control.',
    });
  }

  // Return-Path mismatch
  if (from && returnPath && returnPath.domain.toLowerCase() !== from.domain.toLowerCase()) {
    mismatches.push({
      type: 'return-path-mismatch',
      severity: 'medium',
      description: `Return-Path domain (${returnPath.domain}) differs from From domain (${from.domain})`,
      explanation:
        "The technical return address doesn't match the visible sender. This can happen with legitimate mailing services, but is also used by attackers to bypass spam filters while spoofing the visible sender.",
    });
  }

  // Display name contains different email
  if (from?.name) {
    const embeddedEmail = from.name.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
    if (embeddedEmail && embeddedEmail[0].toLowerCase() !== from.email.toLowerCase()) {
      mismatches.push({
        type: 'display-name-mismatch',
        severity: 'high',
        description: `Display name contains email "${embeddedEmail[0]}" but actual address is "${from.email}"`,
        explanation:
          "The sender's display name is misleading \u2014 it suggests a different identity than the actual email address. Attackers use this because many email clients show only the display name, hiding the real address.",
      });
    }
  }

  // Free email provider posing as organization
  if (from?.name && ORG_KEYWORDS.test(from.name) && FREE_EMAIL_PROVIDERS.has(from.domain.toLowerCase())) {
    mismatches.push({
      type: 'free-email-org',
      severity: 'medium',
      description: `"${from.name}" uses free email provider ${from.domain}`,
      explanation:
        'This email claims to be from an organization but uses a free email provider. Legitimate businesses typically send from their own domain.',
    });
  }

  // Lookalike domain
  if (from) {
    const fromLabel = domainLabel(from.domain.toLowerCase());
    for (const [brand, brandDomain] of Object.entries(BRAND_DOMAINS)) {
      const brandLabel = domainLabel(brandDomain);
      if (fromLabel === brandLabel) continue;

      if (levenshtein(fromLabel, brandLabel) <= 2) {
        mismatches.push({
          type: 'lookalike-domain',
          severity: 'high',
          description: `Domain "${from.domain}" looks similar to ${brand}`,
          explanation: `This email comes from a domain that looks very similar to ${brand}. Attackers register lookalike domains to trick recipients into thinking the email is legitimate.`,
        });
        break;
      }

      const normFrom = applySubstitutions(fromLabel);
      const normBrand = applySubstitutions(brandLabel);
      if (normFrom === normBrand && fromLabel !== brandLabel) {
        mismatches.push({
          type: 'lookalike-domain',
          severity: 'high',
          description: `Domain "${from.domain}" uses character substitution to mimic ${brand}`,
          explanation: `This email comes from a domain that looks very similar to ${brand}. Attackers register lookalike domains to trick recipients into thinking the email is legitimate.`,
        });
        break;
      }
    }
  }

  return { from, replyTo, returnPath, mismatches };
}
