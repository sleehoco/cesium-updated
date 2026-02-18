/**
 * Email Header Analyzer — main entry point.
 * Orchestrates all analysis modules into a single result.
 */

import type { ParsedHeader, HeaderAnalysis } from './types';
import { parseHeaders } from './header-parser';
import { analyzeAuth } from './auth-analyzer';
import { analyzeSender } from './sender-analyzer';
import { analyzeRouting } from './routing-analyzer';
import { detectRedFlags } from './red-flags';

function computeRiskScore(
  auth: ReturnType<typeof analyzeAuth>,
  sender: ReturnType<typeof analyzeSender>,
  routing: ReturnType<typeof analyzeRouting>,
  redFlags: ReturnType<typeof detectRedFlags>
): number {
  let score = 0;

  // Authentication failures
  if (auth.verdict === 'failed') score += 30;
  else if (auth.verdict === 'no-authentication') score += 15;
  else if (auth.verdict === 'partially-authenticated') score += 10;

  // Sender mismatches
  for (const m of sender.mismatches) {
    if (m.severity === 'high') score += 25;
    else if (m.severity === 'medium') score += 15;
    else score += 5;
  }

  // Routing flags
  for (const f of routing.flags) {
    if (f.severity === 'high') score += 15;
    else if (f.severity === 'medium') score += 10;
    else score += 5;
  }

  // Red flags
  for (const r of redFlags) {
    score += r.riskScore;
  }

  return Math.min(score, 100);
}

function getRiskLevel(score: number): { level: HeaderAnalysis['riskLevel']; label: string } {
  if (score >= 71) return { level: 'critical', label: 'Critical Risk' };
  if (score >= 41) return { level: 'high', label: 'High Risk' };
  if (score >= 16) return { level: 'medium', label: 'Medium Risk' };
  return { level: 'low', label: 'Low Risk' };
}

function generateSummary(analysis: Omit<HeaderAnalysis, 'summary'>): string {
  const parts: string[] = [];

  // Auth summary
  parts.push(`Authentication: ${analysis.auth.verdictLabel}.`);

  // Sender issues
  if (analysis.sender.mismatches.length > 0) {
    parts.push(`Found ${analysis.sender.mismatches.length} sender identity issue${analysis.sender.mismatches.length > 1 ? 's' : ''}.`);
  }

  // Routing
  if (analysis.routing.flags.length > 0) {
    parts.push(`${analysis.routing.flags.length} routing anomal${analysis.routing.flags.length > 1 ? 'ies' : 'y'} detected.`);
  }

  // Red flags
  if (analysis.redFlags.length > 0) {
    const high = analysis.redFlags.filter((r) => r.severity === 'high').length;
    if (high > 0) {
      parts.push(`${high} high-severity red flag${high > 1 ? 's' : ''} found.`);
    } else {
      parts.push(`${analysis.redFlags.length} red flag${analysis.redFlags.length > 1 ? 's' : ''} found.`);
    }
  }

  if (analysis.riskLevel === 'low' && analysis.sender.mismatches.length === 0 && analysis.redFlags.length === 0) {
    parts.push('This email appears to be legitimate based on header analysis.');
  }

  return parts.join(' ');
}

export function analyzeEmailHeaders(rawHeaders: string): HeaderAnalysis {
  const headers: ParsedHeader[] = parseHeaders(rawHeaders);
  const auth = analyzeAuth(headers);
  const sender = analyzeSender(headers);
  const routing = analyzeRouting(headers);
  const redFlags = detectRedFlags(headers);
  const riskScore = computeRiskScore(auth, sender, routing, redFlags);
  const { level: riskLevel, label: riskLabel } = getRiskLevel(riskScore);

  const partial = {
    raw: rawHeaders,
    headers,
    auth,
    sender,
    routing,
    redFlags,
    riskScore,
    riskLevel,
    riskLabel,
  };

  return {
    ...partial,
    summary: generateSummary(partial as Omit<HeaderAnalysis, 'summary'>),
  };
}

export type { HeaderAnalysis, ParsedHeader } from './types';
