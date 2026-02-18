'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, Loader2, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HeaderCheck {
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

interface HeaderScanResult {
  url: string;
  headers: HeaderCheck[];
  totalScore: number;
  maxPossibleScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'text-green-400';
    case 'B':
      return 'text-violet-400';
    case 'C':
      return 'text-yellow-400';
    case 'D':
      return 'text-orange-400';
    case 'F':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

function getGradeBgColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-green-500/20 border-green-500/50';
    case 'B':
      return 'bg-violet-500/20 border-violet-500/50';
    case 'C':
      return 'bg-yellow-500/20 border-yellow-500/50';
    case 'D':
      return 'bg-orange-500/20 border-orange-500/50';
    case 'F':
      return 'bg-red-500/20 border-red-500/50';
    default:
      return 'bg-gray-500/20 border-gray-500/50';
  }
}

function getProgressColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-green-500';
    case 'B':
      return 'bg-violet-600';
    case 'C':
      return 'bg-yellow-500';
    case 'D':
      return 'bg-orange-500';
    case 'F':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

function getStatusIcon(status: 'pass' | 'fail' | 'warning') {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />;
    case 'fail':
      return <XCircle className="h-5 w-5 text-red-500 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />;
  }
}

function getStatusBadge(status: 'pass' | 'fail' | 'warning') {
  switch (status) {
    case 'pass':
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/20">
          Pass
        </Badge>
      );
    case 'fail':
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/20">
          Fail
        </Badge>
      );
    case 'warning':
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/20">
          Warning
        </Badge>
      );
  }
}

export default function HeadersScannerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeaderScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to scan');
      return;
    }

    let scanUrl = url.trim();
    if (!scanUrl.startsWith('http://') && !scanUrl.startsWith('https://')) {
      scanUrl = `https://${scanUrl}`;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze/headers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: scanUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (domain: string) => {
    setUrl(`https://${domain}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleScan();
    }
  };

  return (
    <main className="bg-black">
      {/* Header */}
      <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Globe className="h-10 w-10 text-violet-400" />
              <h1 className="text-4xl lg:text-5xl font-bold text-white font-display">
                Website Security Headers <span className="text-violet-400">Scanner</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Analyze any website&apos;s HTTP security headers. Check for Content-Security-Policy, HSTS, X-Frame-Options, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Input Section */}
          <Card className="bg-[#121212] border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl font-bold font-display">Enter URL to Scan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50"
              />

              {/* Quick Examples */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400">Quick examples:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExample('google.com')}
                  disabled={loading}
                  className="border-white/10 text-violet-400 hover:bg-white/5 rounded-lg text-xs"
                >
                  Try google.com
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExample('github.com')}
                  disabled={loading}
                  className="border-white/10 text-violet-400 hover:bg-white/5 rounded-lg text-xs"
                >
                  Try github.com
                </Button>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-500/10 border-red-500/50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {/* Scan Button */}
              <Button
                onClick={handleScan}
                disabled={loading || !url.trim()}
                variant="accent"
                className="w-full py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Scanning Headers...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-5 w-5" />
                    Scan Headers
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <>
              {/* Grade + Score */}
              <Card className="bg-[#121212] border-white/10 mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center ${getGradeBgColor(result.grade)}`}
                      >
                        <span className={`text-5xl font-bold font-display ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white font-display">
                          Score: {result.totalScore}/{result.maxPossibleScore}
                        </h2>
                        <p className="text-gray-400 mt-1">{result.url}</p>
                      </div>
                    </div>
                    <div className="w-full md:w-64">
                      <Progress
                        value={result.totalScore}
                        indicatorClassName={getProgressColor(result.grade)}
                        className="h-3"
                      />
                      <p className="text-sm text-gray-400 mt-2 text-center">
                        {result.headers.filter((h) => h.status === 'pass').length} of{' '}
                        {result.headers.length} headers configured
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Header Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {result.headers.map((header) => (
                  <Card key={header.key} className="bg-[#121212] border-white/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(header.status)}
                          <CardTitle className="text-white text-lg font-display">
                            {header.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(header.status)}
                          <span className="text-sm text-gray-400">
                            {header.score}/{header.maxScore} pts
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {header.found && header.value && (
                        <div className="bg-[#0A0A0A] font-mono text-sm p-2 rounded break-all text-gray-300">
                          {header.value}
                        </div>
                      )}

                      <p className="text-sm text-gray-300">{header.explanation}</p>

                      {header.status !== 'pass' && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-200">{header.recommendation}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Lead CTA */}
              <Card className="bg-[#121212] border-white/10">
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white font-display mb-2">
                    Want to harden your web security?
                  </h2>
                  <p className="text-gray-300 max-w-xl mx-auto mb-6">
                    Our team can configure proper security headers and conduct a comprehensive security assessment of your web applications.
                  </p>
                  <Link href="/contact?service=security-assessment">
                    <Button variant="accent" size="lg" className="text-lg px-8">
                      Get a Security Assessment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
