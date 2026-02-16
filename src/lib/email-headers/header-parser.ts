/**
 * RFC 5322 Email Header Parser
 * Runs entirely client-side in the browser (no Node.js APIs).
 */

import type { ParsedHeader } from './types';

/**
 * Parse raw email header text into an array of header name-value pairs.
 * Handles RFC 5322 header folding, both \r\n and \n line endings,
 * and stops at the blank line header/body separator.
 */
export function parseHeaders(rawHeaders: string): ParsedHeader[] {
  const headers: ParsedHeader[] = [];
  if (!rawHeaders) return headers;

  const normalized = rawHeaders.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  let currentName: string | null = null;
  let currentValue: string | null = null;

  for (const line of lines) {
    if (line.trim() === '') break;

    // Continuation line (starts with whitespace)
    if ((line.startsWith(' ') || line.startsWith('\t')) && currentName !== null) {
      currentValue = (currentValue ?? '') + ' ' + line.trim();
      continue;
    }

    if (currentName !== null && currentValue !== null) {
      headers.push({ name: currentName, value: currentValue });
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      currentName = null;
      currentValue = null;
      continue;
    }

    currentName = line.slice(0, colonIndex).trim();
    currentValue = line.slice(colonIndex + 1).trim();
  }

  if (currentName !== null && currentValue !== null) {
    headers.push({ name: currentName, value: currentValue });
  }

  return headers;
}

/** Case-insensitive lookup, returns first match or null. */
export function getHeader(headers: ParsedHeader[], name: string): string | null {
  const lowerName = name.toLowerCase();
  for (const header of headers) {
    if (header.name.toLowerCase() === lowerName) return header.value;
  }
  return null;
}

/** Case-insensitive lookup, returns all matches. */
export function getHeaders(headers: ParsedHeader[], name: string): string[] {
  const lowerName = name.toLowerCase();
  return headers.filter((h) => h.name.toLowerCase() === lowerName).map((h) => h.value);
}

/** Parse "Display Name <email@domain.com>" or bare "email@domain.com". */
export function parseEmailAddress(
  value: string
): { name: string | null; email: string; domain: string } | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Try "Display Name <email@domain.com>" format
  const angleMatch = trimmed.match(/^(.*?)\s*<([^>]+)>$/);
  if (angleMatch) {
    const rawName = angleMatch[1]!.trim();
    const email = angleMatch[2]!.trim();
    const atIndex = email.lastIndexOf('@');
    if (atIndex <= 0 || atIndex === email.length - 1) return null;

    const domain = email.slice(atIndex + 1);
    let displayName: string | null = rawName;
    if (displayName.startsWith('"') && displayName.endsWith('"')) {
      displayName = displayName.slice(1, -1).trim();
    }
    if (!displayName) displayName = null;

    return { name: displayName, email, domain };
  }

  // Try bare "email@domain.com"
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === trimmed.length - 1 || trimmed.includes(' ')) return null;

  return { name: null, email: trimmed, domain: trimmed.slice(atIndex + 1) };
}
