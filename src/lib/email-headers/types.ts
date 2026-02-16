/**
 * TypeScript interfaces for the Email Header Analyzer tool.
 *
 * These types model every stage of client-side email header analysis:
 * raw parsing, authentication checks, sender identity verification,
 * routing/hop analysis, red-flag detection, and the aggregated result.
 */

/** A single header extracted from the raw email header block. */
export interface ParsedHeader {
  /** Header field name (e.g. "From", "Received", "X-Mailer"). */
  name: string;
  /** The full, unfolded value of the header field. */
  value: string;
}

/** The result of a single email authentication check (SPF, DKIM, or DMARC). */
export interface AuthResult {
  /** Which authentication mechanism produced this result. */
  method: 'spf' | 'dkim' | 'dmarc';
  /** The outcome reported by the authenticating server. */
  result: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none' | 'temperror' | 'permerror';
  /** The domain that was evaluated (e.g. the DKIM signing domain). */
  domain?: string;
  /** Optional raw detail string taken directly from the header value. */
  details?: string;
  /** A plain-English explanation of what this result means for the recipient. */
  explanation: string;
}

/**
 * Aggregated authentication summary combining SPF, DKIM, and DMARC results
 * into a single verdict with a human-readable label and color hint.
 */
export interface AuthSummary {
  spf: AuthResult | null;
  dkim: AuthResult | null;
  dmarc: AuthResult | null;
  verdict: 'fully-authenticated' | 'partially-authenticated' | 'failed' | 'no-authentication';
  verdictLabel: string;
  verdictColor: string;
}

/**
 * Extracted sender-related addresses and any mismatches between them that
 * could indicate spoofing or deceptive practices.
 */
export interface SenderIdentity {
  from: { name: string | null; email: string; domain: string } | null;
  replyTo: { name: string | null; email: string; domain: string } | null;
  returnPath: { email: string; domain: string } | null;
  mismatches: SenderMismatch[];
}

/** A mismatch detected among sender-related headers that may signal phishing. */
export interface SenderMismatch {
  type: 'reply-to-mismatch' | 'return-path-mismatch' | 'display-name-mismatch' | 'free-email-org' | 'lookalike-domain';
  severity: 'low' | 'medium' | 'high';
  description: string;
  explanation: string;
}

/** A single hop in the email delivery chain, extracted from a Received header. */
export interface RoutingHop {
  index: number;
  from: string | null;
  by: string | null;
  ip: string | null;
  timestamp: Date | null;
  delay: number | null;
  raw: string;
}

/** Complete routing analysis with ordered hops and security flags. */
export interface RoutingAnalysis {
  hops: RoutingHop[];
  totalHops: number;
  flags: RoutingFlag[];
}

/** A flag raised when a routing hop exhibits suspicious characteristics. */
export interface RoutingFlag {
  type: 'excessive-delay' | 'missing-info' | 'suspicious-relay';
  description: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

/** A red flag identified in email headers indicating potential threat. */
export interface RedFlag {
  category: 'bulk-mail' | 'missing-headers' | 'suspicious-origin' | 'encoding-tricks' | 'infrastructure';
  header: string;
  value?: string;
  description: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
  riskScore: number;
}

/** The complete result of analysing a set of email headers. */
export interface HeaderAnalysis {
  raw: string;
  headers: ParsedHeader[];
  auth: AuthSummary;
  sender: SenderIdentity;
  routing: RoutingAnalysis;
  redFlags: RedFlag[];
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskLabel: string;
  summary: string;
}
