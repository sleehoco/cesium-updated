'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Loader2, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

interface SPFResult {
  found: boolean;
  record: string | null;
  policy: 'pass' | 'softfail' | 'hardfail' | 'neutral' | 'none';
  score: number;
  issues: string[];
  explanation: string;
}

interface DMARCResult {
  found: boolean;
  record: string | null;
  policy: 'none' | 'quarantine' | 'reject' | null;
  score: number;
  issues: string[];
  explanation: string;
}

interface DKIMResult {
  found: boolean;
  selectors: string[];
  score: number;
  explanation: string;
}

interface EmailSecurityResult {
  domain: string;
  spf: SPFResult;
  dmarc: DMARCResult;
  dkim: DKIMResult;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-green-500 text-white';
    case 'B':
      return 'bg-green-400 text-white';
    case 'C':
      return 'bg-yellow-500 text-white';
    case 'D':
      return 'bg-orange-500 text-white';
    case 'F':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getGradeBorderColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'border-green-500';
    case 'B':
      return 'border-green-400';
    case 'C':
      return 'border-yellow-500';
    case 'D':
      return 'border-orange-500';
    case 'F':
      return 'border-red-500';
    default:
      return 'border-gray-500';
  }
}

function StatusIcon({ found, hasIssues }: { found: boolean; hasIssues: boolean }) {
  if (!found) {
    return <XCircle className="h-6 w-6 text-red-500" />;
  }
  if (hasIssues) {
    return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
  }
  return <CheckCircle2 className="h-6 w-6 text-green-500" />;
}

export default function EmailSecurityPage() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailSecurityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    const trimmed = domain.trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter a domain to check');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze/email-security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Check failed');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && domain.trim()) {
      handleCheck();
    }
  };

  const quickExamples = [
    { label: 'Try gmail.com', value: 'gmail.com' },
    { label: 'Try yahoo.com', value: 'yahoo.com' },
    { label: 'Try outlook.com', value: 'outlook.com' },
  ];

  return (
    <main className="bg-black">
      {/* Header */}
      <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Mail className="h-10 w-10 text-violet-400" />
              <h1 className="text-4xl lg:text-5xl font-bold text-white font-display">
                Email Security <span className="text-violet-400">Checker</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Check your domain&apos;s email authentication records. Analyze SPF, DMARC, and DKIM
              configuration to prevent spoofing and phishing attacks.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Domain Input Card */}
          <Card className="bg-[#121212] border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl font-bold font-display">Enter Domain</CardTitle>
              <CardDescription className="text-gray-400">
                Enter a domain name to check its email security configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50"
              />

              {/* Quick Examples */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400">Quick examples:</span>
                {quickExamples.map((example) => (
                  <Button
                    key={example.value}
                    variant="outline"
                    size="sm"
                    onClick={() => setDomain(example.value)}
                    disabled={loading}
                    className="border-white/10 text-violet-400 hover:bg-white/5 rounded-lg text-xs"
                  >
                    {example.label}
                  </Button>
                ))}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-500/10 border-red-500/50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {/* Check Button */}
              <Button
                onClick={handleCheck}
                disabled={loading || !domain.trim()}
                variant="accent"
                className="w-full py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Checking DNS Records...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Check Email Security
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <>
              {/* Grade Overview */}
              <Card className="bg-[#121212] border-white/10 mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Grade Badge */}
                    <div className={`flex-shrink-0 w-32 h-32 rounded-2xl border-4 ${getGradeBorderColor(result.grade)} flex flex-col items-center justify-center ${getGradeColor(result.grade)}`}>
                      <span className="text-5xl font-bold font-display">{result.grade}</span>
                      <span className="text-sm font-semibold opacity-90">Grade</span>
                    </div>

                    {/* Score Details */}
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-white font-display mb-2">
                        Email Security Score: {result.overallScore}/100
                      </h2>
                      <p className="text-gray-400 mb-4">
                        Results for <span className="text-violet-400 font-semibold">{result.domain}</span>
                      </p>

                      {/* Score Breakdown Bar */}
                      <div className="flex gap-1 items-center">
                        <div className="flex-1 bg-[#0A0A0A] rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              result.overallScore >= 90
                                ? 'bg-green-500'
                                : result.overallScore >= 75
                                ? 'bg-green-400'
                                : result.overallScore >= 60
                                ? 'bg-yellow-500'
                                : result.overallScore >= 40
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${result.overallScore}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 ml-2 w-12">{result.overallScore}%</span>
                      </div>

                      {/* Component Scores */}
                      <div className="flex flex-wrap gap-4 mt-4">
                        <Badge className="bg-[#0A0A0A] border-white/10 text-gray-300 px-3 py-1">
                          SPF: {result.spf.score}/30
                        </Badge>
                        <Badge className="bg-[#0A0A0A] border-white/10 text-gray-300 px-3 py-1">
                          DMARC: {result.dmarc.score}/40
                        </Badge>
                        <Badge className="bg-[#0A0A0A] border-white/10 text-gray-300 px-3 py-1">
                          DKIM: {result.dkim.score}/30
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SPF Section */}
              <Card className="bg-[#121212] border-white/10 mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon found={result.spf.found} hasIssues={result.spf.issues.length > 0} />
                      <div>
                        <CardTitle className="text-white text-xl font-bold font-display">
                          SPF (Sender Policy Framework)
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Specifies which mail servers are authorized to send email for this domain
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={`px-3 py-1 ${
                        result.spf.score >= 25
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : result.spf.score >= 15
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                      }`}
                    >
                      {result.spf.score}/30
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Record Value */}
                  {result.spf.record && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Record Value</p>
                      <code className="text-sm text-violet-400 break-all">{result.spf.record}</code>
                    </div>
                  )}

                  {/* Explanation */}
                  <p className="text-gray-300 leading-relaxed">{result.spf.explanation}</p>

                  {/* Issues */}
                  {result.spf.issues.length > 0 && (
                    <div className="space-y-2">
                      {result.spf.issues.map((issue, i) => (
                        <Alert key={i} className="bg-yellow-500/10 border-yellow-500/50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <AlertDescription className="text-yellow-200">{issue}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* DMARC Section */}
              <Card className="bg-[#121212] border-white/10 mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon found={result.dmarc.found} hasIssues={result.dmarc.issues.length > 0} />
                      <div>
                        <CardTitle className="text-white text-xl font-bold font-display">
                          DMARC (Domain-based Message Authentication)
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Tells receiving servers what to do when SPF or DKIM checks fail
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={`px-3 py-1 ${
                        result.dmarc.score >= 30
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : result.dmarc.score >= 15
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                      }`}
                    >
                      {result.dmarc.score}/40
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Record Value */}
                  {result.dmarc.record && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Record Value</p>
                      <code className="text-sm text-violet-400 break-all">{result.dmarc.record}</code>
                    </div>
                  )}

                  {/* Policy Badge */}
                  {result.dmarc.policy && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Policy:</span>
                      <Badge
                        className={`px-3 py-1 ${
                          result.dmarc.policy === 'reject'
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : result.dmarc.policy === 'quarantine'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            : 'bg-red-500/20 text-red-400 border-red-500/50'
                        }`}
                      >
                        p={result.dmarc.policy}
                      </Badge>
                    </div>
                  )}

                  {/* Explanation */}
                  <p className="text-gray-300 leading-relaxed">{result.dmarc.explanation}</p>

                  {/* Issues */}
                  {result.dmarc.issues.length > 0 && (
                    <div className="space-y-2">
                      {result.dmarc.issues.map((issue, i) => (
                        <Alert key={i} className="bg-yellow-500/10 border-yellow-500/50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <AlertDescription className="text-yellow-200">{issue}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* DKIM Section */}
              <Card className="bg-[#121212] border-white/10 mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon found={result.dkim.found} hasIssues={false} />
                      <div>
                        <CardTitle className="text-white text-xl font-bold font-display">
                          DKIM (DomainKeys Identified Mail)
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Cryptographically signs outgoing emails to verify sender authenticity
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={`px-3 py-1 ${
                        result.dkim.score >= 30
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                      }`}
                    >
                      {result.dkim.score}/30
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Found Selectors */}
                  {result.dkim.selectors.length > 0 && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        Active Selectors
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.dkim.selectors.map((selector) => (
                          <Badge
                            key={selector}
                            className="bg-green-500/20 text-green-400 border-green-500/50 px-3 py-1"
                          >
                            {selector}._domainkey
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <p className="text-gray-300 leading-relaxed">{result.dkim.explanation}</p>
                </CardContent>
              </Card>

              {/* Lead CTA */}
              <Card className="bg-[#121212] border-white/10 mt-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-violet-400" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-white font-display mb-2">
                        Need help configuring email security?
                      </h3>
                      <p className="text-gray-400">
                        We can set up SPF, DKIM, and DMARC for your domain to prevent spoofing and
                        phishing attacks.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Link href="/contact?service=cloud-security-m365">
                        <Button variant="accent" size="lg" className="rounded-lg">
                          Get Email Security Setup
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
