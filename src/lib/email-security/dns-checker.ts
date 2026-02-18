/**
 * Email Security DNS Checker
 * Checks SPF, DMARC, and DKIM records for a domain using Node.js built-in dns module.
 */

import dns from 'dns';

const resolver = new dns.promises.Resolver();

// Set a timeout so DNS lookups don't hang forever
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

export interface SPFResult {
  found: boolean;
  record: string | null;
  policy: 'pass' | 'softfail' | 'hardfail' | 'neutral' | 'none';
  score: number; // 0-30
  issues: string[];
  explanation: string;
}

export interface DMARCResult {
  found: boolean;
  record: string | null;
  policy: 'none' | 'quarantine' | 'reject' | null;
  score: number; // 0-40
  issues: string[];
  explanation: string;
}

export interface DKIMResult {
  found: boolean;
  selectors: string[]; // which selectors were found
  score: number; // 0-30
  explanation: string;
}

export interface EmailSecurityResult {
  domain: string;
  spf: SPFResult;
  dmarc: DMARCResult;
  dkim: DKIMResult;
  overallScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

/**
 * Check SPF (Sender Policy Framework) record for a domain.
 */
async function checkSPF(domain: string): Promise<SPFResult> {
  const result: SPFResult = {
    found: false,
    record: null,
    policy: 'none',
    score: 0,
    issues: [],
    explanation: '',
  };

  try {
    const records = await resolver.resolveTxt(domain);
    // TXT records come back as arrays of strings (chunks), join them
    const txtRecords = records.map((chunks) => chunks.join(''));
    const spfRecord = txtRecords.find((r) => r.toLowerCase().startsWith('v=spf1'));

    if (!spfRecord) {
      result.issues.push('No SPF record found');
      result.explanation =
        'This domain does not have an SPF record. Without SPF, anyone can send email pretending to be from this domain. This makes the domain vulnerable to email spoofing and phishing attacks.';
      return result;
    }

    result.found = true;
    result.record = spfRecord;

    const recordLower = spfRecord.toLowerCase();

    if (recordLower.includes('+all')) {
      result.policy = 'pass';
      result.score = 5;
      result.issues.push('SPF allows any server to send email (dangerous!)');
      result.explanation =
        'This domain has an SPF record, but it uses "+all" which allows ANY server to send email on behalf of this domain. This is extremely dangerous and effectively provides no protection against spoofing.';
    } else if (recordLower.includes('-all')) {
      result.policy = 'hardfail';
      result.score = 30;
      result.explanation =
        'This domain has a strong SPF policy with "-all" (hardfail). Emails from unauthorized servers will be rejected. This is the recommended configuration for maximum protection against spoofing.';
    } else if (recordLower.includes('~all')) {
      result.policy = 'softfail';
      result.score = 20;
      result.issues.push('SPF uses softfail — consider upgrading to -all');
      result.explanation =
        'This domain has an SPF record with "~all" (softfail). Emails from unauthorized servers will be marked as suspicious but may still be delivered. Consider upgrading to "-all" for stricter enforcement.';
    } else if (recordLower.includes('?all')) {
      result.policy = 'neutral';
      result.score = 10;
      result.issues.push('SPF policy is neutral — no clear stance on unauthorized senders');
      result.explanation =
        'This domain has an SPF record with "?all" (neutral). This means the domain makes no assertion about whether unauthorized servers should be allowed. This provides minimal protection.';
    } else {
      // Has SPF but no explicit all mechanism
      result.policy = 'neutral';
      result.score = 15;
      result.explanation =
        'This domain has an SPF record but does not include an explicit "all" mechanism. The default behavior depends on the receiving mail server. Consider adding "-all" for explicit rejection of unauthorized senders.';
    }
  } catch {
    // DNS lookup failed — treat as not found
    result.issues.push('No SPF record found');
    result.explanation =
      'This domain does not have an SPF record. Without SPF, anyone can send email pretending to be from this domain. This makes the domain vulnerable to email spoofing and phishing attacks.';
  }

  return result;
}

/**
 * Check DMARC (Domain-based Message Authentication, Reporting & Conformance) record for a domain.
 */
async function checkDMARC(domain: string): Promise<DMARCResult> {
  const result: DMARCResult = {
    found: false,
    record: null,
    policy: null,
    score: 0,
    issues: [],
    explanation: '',
  };

  try {
    const records = await resolver.resolveTxt('_dmarc.' + domain);
    const txtRecords = records.map((chunks) => chunks.join(''));
    const dmarcRecord = txtRecords.find((r) => r.toLowerCase().startsWith('v=dmarc1'));

    if (!dmarcRecord) {
      result.issues.push('No DMARC record found');
      result.explanation =
        'This domain does not have a DMARC record. Without DMARC, there is no policy telling receiving servers what to do with emails that fail SPF or DKIM checks. This leaves the domain vulnerable to spoofing.';
      return result;
    }

    result.found = true;
    result.record = dmarcRecord;

    // Parse the p= tag
    const policyMatch = dmarcRecord.match(/;\s*p\s*=\s*(none|quarantine|reject)/i)
      || dmarcRecord.match(/^v=DMARC1;\s*p\s*=\s*(none|quarantine|reject)/i);

    if (policyMatch) {
      const policy = policyMatch[1]!.toLowerCase() as 'none' | 'quarantine' | 'reject';
      result.policy = policy;

      switch (policy) {
        case 'none':
          result.score = 15;
          result.issues.push("DMARC policy set to 'none' — emails failing checks are still delivered");
          result.explanation =
            'This domain has a DMARC record with policy "none". This means failing emails are still delivered normally — DMARC is in monitoring mode only. Consider upgrading to "quarantine" or "reject" for active protection.';
          break;
        case 'quarantine':
          result.score = 30;
          result.explanation =
            'This domain has a DMARC record with policy "quarantine". Emails that fail authentication checks will be sent to the spam/junk folder. This provides good protection while allowing legitimate emails that might fail checks to still reach recipients.';
          break;
        case 'reject':
          result.score = 40;
          result.explanation =
            'This domain has a DMARC record with policy "reject". Emails that fail authentication checks will be completely rejected. This is the strongest level of protection against email spoofing and phishing.';
          break;
      }
    } else {
      // DMARC record exists but no valid p= tag found
      result.policy = null;
      result.score = 10;
      result.issues.push('DMARC record found but policy tag could not be parsed');
      result.explanation =
        'This domain has a DMARC record, but the policy (p=) tag could not be determined. The record may be malformed. Check the record syntax and ensure a valid p= tag is present.';
    }
  } catch {
    // DNS lookup failed — treat as not found
    result.issues.push('No DMARC record found');
    result.explanation =
      'This domain does not have a DMARC record. Without DMARC, there is no policy telling receiving servers what to do with emails that fail SPF or DKIM checks. This leaves the domain vulnerable to spoofing.';
  }

  return result;
}

/**
 * Check DKIM (DomainKeys Identified Mail) records for a domain.
 * Checks common selectors since DKIM selectors are not publicly enumerable.
 */
async function checkDKIM(domain: string): Promise<DKIMResult> {
  const commonSelectors = ['default', 'google', 'selector1', 'selector2', 'k1', 'dkim'];
  const foundSelectors: string[] = [];

  for (const selector of commonSelectors) {
    try {
      const records = await resolver.resolveTxt(selector + '._domainkey.' + domain);
      const txtRecords = records.map((chunks) => chunks.join(''));
      const dkimRecord = txtRecords.find(
        (r) => r.toLowerCase().includes('v=dkim1') || r.toLowerCase().includes('k=rsa')
      );

      if (dkimRecord) {
        foundSelectors.push(selector);
      }
    } catch {
      // ENOTFOUND, ENODATA, etc. — selector not found, continue checking others
      continue;
    }
  }

  const result: DKIMResult = {
    found: foundSelectors.length > 0,
    selectors: foundSelectors,
    score: foundSelectors.length > 0 ? 30 : 0,
    explanation: '',
  };

  if (foundSelectors.length > 0) {
    const selectorList = foundSelectors.map((s) => `"${s}"`).join(', ');
    result.explanation = `DKIM is configured for this domain. Found ${foundSelectors.length} active DKIM selector${foundSelectors.length > 1 ? 's' : ''}: ${selectorList}. This means outgoing emails are cryptographically signed, helping recipients verify that emails genuinely came from this domain and were not altered in transit.`;
  } else {
    result.explanation =
      'No common DKIM selectors were detected for this domain. DKIM selectors checked: default, google, selector1, selector2, k1, dkim. The domain may use custom selectors not in our check list, or DKIM may not be configured. Without DKIM, recipients cannot verify that emails were actually sent by this domain.';
  }

  return result;
}

/**
 * Calculate letter grade from overall score.
 */
function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Run a full email security check for a domain.
 * Checks SPF, DMARC, and DKIM records and returns a comprehensive result.
 */
export async function checkEmailSecurity(domain: string): Promise<EmailSecurityResult> {
  // Run all checks concurrently for speed
  const [spf, dmarc, dkim] = await Promise.all([
    checkSPF(domain),
    checkDMARC(domain),
    checkDKIM(domain),
  ]);

  const overallScore = spf.score + dmarc.score + dkim.score;
  const grade = calculateGrade(overallScore);

  return {
    domain,
    spf,
    dmarc,
    dkim,
    overallScore,
    grade,
  };
}
