/**
 * Security Headers Analysis Logic
 * Checks 7 key security headers and scores them.
 */

export interface HeaderCheck {
  name: string;
  key: string;
  found: boolean;
  value: string | null;
  score: number;
  maxScore: number;
  status: 'pass' | 'fail' | 'warning';
  explanation: string;
  recommendation: string;
}

export interface HeaderScanResult {
  url: string;
  headers: HeaderCheck[];
  totalScore: number;
  maxPossibleScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

const MAX_TOTAL_SCORE = 95;

function checkContentSecurityPolicy(value: string | undefined): HeaderCheck {
  const key = 'content-security-policy';
  const name = 'Content-Security-Policy';
  const maxScore = 25;
  const recommendation =
    "Add a Content-Security-Policy header to prevent XSS attacks. Start with: default-src 'self'; script-src 'self'";

  if (!value) {
    return {
      name,
      key,
      found: false,
      value: null,
      score: 0,
      maxScore,
      status: 'fail',
      explanation: 'No Content-Security-Policy header found',
      recommendation,
    };
  }

  const lowerValue = value.toLowerCase();
  if (lowerValue.includes('unsafe-inline') || lowerValue.includes('unsafe-eval')) {
    return {
      name,
      key,
      found: true,
      value,
      score: 15,
      maxScore,
      status: 'warning',
      explanation: 'CSP contains unsafe directives',
      recommendation:
        "Remove 'unsafe-inline' and 'unsafe-eval' from your CSP to maximize protection against XSS attacks.",
    };
  }

  return {
    name,
    key,
    found: true,
    value,
    score: 25,
    maxScore,
    status: 'pass',
    explanation: 'Content-Security-Policy is properly configured',
    recommendation,
  };
}

function checkStrictTransportSecurity(value: string | undefined): HeaderCheck {
  const key = 'strict-transport-security';
  const name = 'Strict-Transport-Security';
  const maxScore = 20;
  const recommendation =
    'Add Strict-Transport-Security: max-age=31536000; includeSubDomains; preload';

  if (!value) {
    return {
      name,
      key,
      found: false,
      value: null,
      score: 0,
      maxScore,
      status: 'fail',
      explanation: 'No Strict-Transport-Security header found',
      recommendation,
    };
  }

  const maxAgeMatch = value.match(/max-age=(\d+)/i);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]!, 10) : 0;

  if (maxAge < 31536000) {
    return {
      name,
      key,
      found: true,
      value,
      score: 10,
      maxScore,
      status: 'warning',
      explanation: 'HSTS max-age should be at least 1 year',
      recommendation,
    };
  }

  return {
    name,
    key,
    found: true,
    value,
    score: 20,
    maxScore,
    status: 'pass',
    explanation: 'Strict-Transport-Security is properly configured with a sufficient max-age',
    recommendation,
  };
}

function checkXContentTypeOptions(value: string | undefined): HeaderCheck {
  const key = 'x-content-type-options';
  const name = 'X-Content-Type-Options';
  const maxScore = 10;
  const recommendation = 'Add X-Content-Type-Options: nosniff';

  if (!value) {
    return {
      name,
      key,
      found: false,
      value: null,
      score: 0,
      maxScore,
      status: 'fail',
      explanation: 'No X-Content-Type-Options header found',
      recommendation,
    };
  }

  if (value.toLowerCase() === 'nosniff') {
    return {
      name,
      key,
      found: true,
      value,
      score: 10,
      maxScore,
      status: 'pass',
      explanation: 'X-Content-Type-Options is set to nosniff, preventing MIME-type sniffing',
      recommendation,
    };
  }

  return {
    name,
    key,
    found: true,
    value,
    score: 0,
    maxScore,
    status: 'fail',
    explanation: 'X-Content-Type-Options must be set to "nosniff"',
    recommendation,
  };
}

function checkXFrameOptions(value: string | undefined): HeaderCheck {
  const key = 'x-frame-options';
  const name = 'X-Frame-Options';
  const maxScore = 15;
  const recommendation = 'Add X-Frame-Options: DENY (or SAMEORIGIN if you use iframes)';

  if (!value) {
    return {
      name,
      key,
      found: false,
      value: null,
      score: 0,
      maxScore,
      status: 'fail',
      explanation: 'No X-Frame-Options header found',
      recommendation,
    };
  }

  const upper = value.toUpperCase();
  if (upper === 'DENY' || upper === 'SAMEORIGIN') {
    return {
      name,
      key,
      found: true,
      value,
      score: 15,
      maxScore,
      status: 'pass',
      explanation: `X-Frame-Options is set to ${upper}, protecting against clickjacking`,
      recommendation,
    };
  }

  return {
    name,
    key,
    found: true,
    value,
    score: 0,
    maxScore,
    status: 'fail',
    explanation: 'X-Frame-Options must be set to DENY or SAMEORIGIN',
    recommendation,
  };
}

function checkReferrerPolicy(value: string | undefined): HeaderCheck {
  const key = 'referrer-policy';
  const name = 'Referrer-Policy';
  const maxScore = 10;
  const recommendation = 'Add Referrer-Policy: strict-origin-when-cross-origin';

  if (!value) {
    return {
      name,
      key,
      found: false,
      value: null,
      score: 0,
      maxScore,
      status: 'fail',
      explanation: 'No Referrer-Policy header found',
      recommendation,
    };
  }

  return {
    name,
    key,
    found: true,
    value,
    score: 10,
    maxScore,
    status: 'pass',
    explanation: 'Referrer-Policy is configured, controlling how much referrer information is shared',
    recommendation,
  };
}

function checkPermissionsPolicy(value: string | undefined): HeaderCheck {
  const key = 'permissions-policy';
  const name = 'Permissions-Policy';
  const maxScore = 10;
  const recommendation = 'Add Permissions-Policy: camera=(), microphone=(), geolocation=()';

  if (!value) {
    return {
      name,
      key,
      found: false,
      value: null,
      score: 0,
      maxScore,
      status: 'fail',
      explanation: 'No Permissions-Policy header found',
      recommendation,
    };
  }

  return {
    name,
    key,
    found: true,
    value,
    score: 10,
    maxScore,
    status: 'pass',
    explanation: 'Permissions-Policy is configured, restricting browser feature access',
    recommendation,
  };
}

function checkXXSSProtection(value: string | undefined): HeaderCheck {
  const key = 'x-xss-protection';
  const name = 'X-XSS-Protection';
  const maxScore = 5;
  const recommendation = 'While deprecated, add X-XSS-Protection: 0 (rely on CSP instead)';

  if (!value) {
    return {
      name,
      key,
      found: false,
      value: null,
      score: 0,
      maxScore,
      status: 'fail',
      explanation: 'No X-XSS-Protection header found (note: this header is deprecated in favor of CSP)',
      recommendation,
    };
  }

  return {
    name,
    key,
    found: true,
    value,
    score: 5,
    maxScore,
    status: 'pass',
    explanation:
      'X-XSS-Protection is present. Note: this header is deprecated in modern browsers in favor of Content-Security-Policy',
    recommendation,
  };
}

function calculateGrade(normalizedScore: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (normalizedScore >= 90) return 'A';
  if (normalizedScore >= 75) return 'B';
  if (normalizedScore >= 60) return 'C';
  if (normalizedScore >= 40) return 'D';
  return 'F';
}

export function analyzeHeaders(
  url: string,
  responseHeaders: Record<string, string>
): HeaderScanResult {
  const headers: HeaderCheck[] = [
    checkContentSecurityPolicy(responseHeaders['content-security-policy']),
    checkStrictTransportSecurity(responseHeaders['strict-transport-security']),
    checkXContentTypeOptions(responseHeaders['x-content-type-options']),
    checkXFrameOptions(responseHeaders['x-frame-options']),
    checkReferrerPolicy(responseHeaders['referrer-policy']),
    checkPermissionsPolicy(responseHeaders['permissions-policy']),
    checkXXSSProtection(responseHeaders['x-xss-protection']),
  ];

  const totalScore = headers.reduce((sum, h) => sum + h.score, 0);
  const normalizedScore = Math.round((totalScore / MAX_TOTAL_SCORE) * 100);
  const grade = calculateGrade(normalizedScore);

  return {
    url,
    headers,
    totalScore: normalizedScore,
    maxPossibleScore: 100,
    grade,
  };
}
