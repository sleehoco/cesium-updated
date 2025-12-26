/**
 * URL Verification and Threat Intelligence
 * Checks URLs against multiple threat intelligence sources
 */

const URL_CHECK_TIMEOUT = 30000; // 30 seconds

export interface URLCheckResult {
  url: string;
  isClean: boolean;
  isMalicious: boolean;
  isSuspicious: boolean;
  sources: {
    virusTotal?: {
      malicious: number;
      suspicious: number;
      clean: number;
      undetected: number;
    };
    urlScan?: {
      malicious: boolean;
      score: number;
    };
    googleSafeBrowsing?: {
      threat: boolean;
      threatType?: string;
    };
  };
  findings: string[];
  reputation: 'clean' | 'suspicious' | 'malicious' | 'unknown';
}

/**
 * Extract URLs from text content
 */
export function extractURLs(text: string): string[] {
  // Regex to match URLs (http, https, and naked domains)
  const urlRegex = /(?:(?:https?):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gi;

  const matches = text.match(urlRegex) || [];

  // Deduplicate and normalize URLs
  const urls = new Set<string>();
  matches.forEach(url => {
    let normalized = url.trim();
    // Add protocol if missing
    if (!normalized.startsWith('http')) {
      normalized = 'https://' + normalized;
    }
    urls.add(normalized);
  });

  return Array.from(urls);
}

/**
 * Check URL against VirusTotal
 */
async function checkVirusTotal(url: string): Promise<URLCheckResult['sources']['virusTotal']> {
  if (!process.env['VIRUSTOTAL_API_KEY']) {
    return undefined;
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), URL_CHECK_TIMEOUT);

  try {
    // URL-safe base64 encoding
    const urlId = Buffer.from(url).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const response = await fetch(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      {
        headers: {
          'x-apikey': process.env['VIRUSTOTAL_API_KEY'],
        },
        signal: abortController.signal,
      }
    );

    clearTimeout(timeoutId);

    if (response.status === 404) {
      // URL not found in VT database, submit it for analysis
      const submitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: {
          'x-apikey': process.env['VIRUSTOTAL_API_KEY'],
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodeURIComponent(url)}`,
      });

      if (!submitResponse.ok) {
        return undefined;
      }

      // Return unknown for newly submitted URLs
      return {
        malicious: 0,
        suspicious: 0,
        clean: 0,
        undetected: 0,
      };
    }

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    const stats = data.data?.attributes?.last_analysis_stats;

    if (stats) {
      return {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        clean: stats.harmless || 0,
        undetected: stats.undetected || 0,
      };
    }

    return undefined;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('VirusTotal URL check timed out');
    }
    return undefined;
  }
}

/**
 * Check URL against URLScan.io (free tier - limited)
 */
async function checkURLScan(_url: string): Promise<URLCheckResult['sources']['urlScan']> {
  // URLScan.io requires API key for automated checks
  // For now, return undefined - can be implemented with API key
  return undefined;
}

/**
 * Analyze URL characteristics (heuristic checks)
 */
function analyzeURLCharacteristics(url: string): {
  isSuspicious: boolean;
  findings: string[];
} {
  const findings: string[] = [];
  let isSuspicious = false;

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Check for IP address instead of domain
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
      findings.push('URL uses IP address instead of domain name');
      isSuspicious = true;
    }

    // Check for suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club'];
    if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
      findings.push(`Suspicious TLD: ${domain.split('.').pop()}`);
      isSuspicious = true;
    }

    // Check for excessive subdomains
    const parts = domain.split('.');
    if (parts.length > 4) {
      findings.push(`Excessive subdomains: ${parts.length - 2} levels`);
      isSuspicious = true;
    }

    // Check for URL shorteners
    const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly'];
    if (shorteners.some(shortener => domain.includes(shortener))) {
      findings.push('URL shortener detected');
      isSuspicious = true;
    }

    // Check for suspicious keywords in domain
    const suspiciousKeywords = [
      'verify', 'account', 'secure', 'login', 'update', 'confirm',
      'banking', 'paypal', 'amazon', 'apple', 'microsoft', 'google'
    ];
    const domainLower = domain.toLowerCase();
    suspiciousKeywords.forEach(keyword => {
      if (domainLower.includes(keyword) && !domainLower.endsWith(`${keyword}.com`)) {
        findings.push(`Suspicious keyword in domain: "${keyword}"`);
        isSuspicious = true;
      }
    });

    // Check for homograph attacks (mixed character sets)
    if (/[а-яА-Я]/.test(domain) || /[α-ωΑ-Ω]/.test(domain)) {
      findings.push('Possible homograph attack (Cyrillic/Greek characters)');
      isSuspicious = true;
    }

    // Check for very long domains
    if (domain.length > 40) {
      findings.push(`Unusually long domain name: ${domain.length} characters`);
      isSuspicious = true;
    }

    // Check for excessive hyphens
    const hyphenCount = (domain.match(/-/g) || []).length;
    if (hyphenCount > 3) {
      findings.push(`Excessive hyphens in domain: ${hyphenCount}`);
      isSuspicious = true;
    }

    // Check URL path for suspicious patterns
    const path = urlObj.pathname + urlObj.search;
    if (path.length > 100) {
      findings.push('Unusually long URL path');
      isSuspicious = true;
    }

    // Check for @ symbol in URL (often used in phishing)
    if (url.includes('@')) {
      findings.push('URL contains @ symbol (authentication bypass attempt)');
      isSuspicious = true;
    }

  } catch {
    findings.push('Invalid URL format');
    isSuspicious = true;
  }

  return { isSuspicious, findings };
}

/**
 * Check URL reputation across multiple sources
 */
export async function checkURL(url: string): Promise<URLCheckResult> {
  const sources: URLCheckResult['sources'] = {};
  const allFindings: string[] = [];

  // Run all checks in parallel
  const [vtResult, urlScanResult, heuristicResult] = await Promise.all([
    checkVirusTotal(url),
    checkURLScan(url),
    Promise.resolve(analyzeURLCharacteristics(url)),
  ]);

  // Process VirusTotal results
  if (vtResult) {
    sources.virusTotal = vtResult;
    if (vtResult.malicious > 0) {
      allFindings.push(`VirusTotal: ${vtResult.malicious} vendors flagged as malicious`);
    }
    if (vtResult.suspicious > 0) {
      allFindings.push(`VirusTotal: ${vtResult.suspicious} vendors flagged as suspicious`);
    }
  }

  // Process URLScan results
  if (urlScanResult) {
    sources.urlScan = urlScanResult;
    if (urlScanResult.malicious) {
      allFindings.push('URLScan.io flagged as malicious');
    }
  }

  // Process heuristic findings
  allFindings.push(...heuristicResult.findings);

  // Determine overall reputation
  let reputation: URLCheckResult['reputation'] = 'unknown';
  let isMalicious = false;
  let isSuspicious = false;
  let isClean = false;

  // Check VirusTotal verdict
  if (vtResult) {
    if (vtResult.malicious >= 3) {
      reputation = 'malicious';
      isMalicious = true;
    } else if (vtResult.malicious > 0 || vtResult.suspicious > 2) {
      reputation = 'suspicious';
      isSuspicious = true;
    } else if (vtResult.clean > 10 && vtResult.malicious === 0) {
      reputation = 'clean';
      isClean = true;
    }
  }

  // Override with heuristic analysis if very suspicious
  if (heuristicResult.isSuspicious && heuristicResult.findings.length >= 3) {
    reputation = 'suspicious';
    isSuspicious = true;
  }

  return {
    url,
    isClean,
    isMalicious,
    isSuspicious,
    sources,
    findings: allFindings,
    reputation,
  };
}

/**
 * Check multiple URLs and return aggregated results
 */
export async function checkMultipleURLs(urls: string[]): Promise<URLCheckResult[]> {
  // Limit to first 10 URLs to avoid rate limits
  const urlsToCheck = urls.slice(0, 10);

  // Check all URLs in parallel
  const results = await Promise.all(
    urlsToCheck.map(url => checkURL(url))
  );

  return results;
}
