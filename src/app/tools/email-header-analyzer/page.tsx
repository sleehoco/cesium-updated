'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileSearch,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Shield,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Send,
  Flag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { analyzeEmailHeaders } from '@/lib/email-headers';
import type { HeaderAnalysis } from '@/lib/email-headers';

const SAMPLE_HEADERS = `Delivered-To: user@example.com
Received: by 2002:a17:90a:abc1:0:0:0:0 with SMTP id x1csp123456abc;
        Thu, 13 Feb 2026 10:15:30 -0800 (PST)
Received: from suspicious-relay.example.net (unknown [203.0.113.50])
        by mx.google.com with ESMTPS id abc123;
        Thu, 13 Feb 2026 10:15:25 -0800 (PST)
Authentication-Results: mx.google.com;
       dkim=fail header.i=@example.com;
       spf=softfail (google.com: domain of admin@example.com does not designate 203.0.113.50 as permitted sender) smtp.mailfrom=admin@example.com;
       dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=example.com
From: "IT Support" <admin@exarnple.com>
Reply-To: helpdesk@totallylegit.xyz
Return-Path: <bounce@mass-mailer.net>
To: user@example.com
Subject: =?UTF-8?B?VXJnZW50OiBQYXNzd29yZCBSZXNldCBSZXF1aXJlZA==?=
Date: Thu, 13 Feb 2026 18:15:20 +0000
X-Mailer: sendgrid
X-Spam-Flag: YES
Precedence: bulk`;

const HELP_INSTRUCTIONS = [
  { client: 'Gmail', steps: 'Open email \u2192 Click \u22ee (More) \u2192 "Show original" \u2192 Copy headers above the blank line' },
  { client: 'Outlook (Web)', steps: 'Open email \u2192 Click \u22ee \u2192 "View message source" \u2192 Copy all text' },
  { client: 'Apple Mail', steps: 'Open email \u2192 View \u2192 Message \u2192 All Headers \u2192 Select and copy' },
  { client: 'Yahoo Mail', steps: 'Open email \u2192 Click \u22ee (More) \u2192 "View raw message" \u2192 Copy headers' },
];

function getRiskColor(level: string): string {
  switch (level) {
    case 'critical': return 'text-red-400';
    case 'high': return 'text-orange-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-green-400';
    default: return 'text-gray-400';
  }
}

function getRiskBgColor(level: string): string {
  switch (level) {
    case 'critical': return 'bg-red-500/20 border-red-500/50';
    case 'high': return 'bg-orange-500/20 border-orange-500/50';
    case 'medium': return 'bg-yellow-500/20 border-yellow-500/50';
    case 'low': return 'bg-green-500/20 border-green-500/50';
    default: return 'bg-gray-500/20 border-gray-500/50';
  }
}

function SeverityBadge({ severity }: { severity: 'low' | 'medium' | 'high' }) {
  const colors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-red-500/20 text-red-400 border-red-500/50',
  };
  return <Badge className={`${colors[severity]} text-xs`}>{severity}</Badge>;
}

function CollapsibleExplanation({ explanation }: { explanation: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
      >
        <Info className="h-3 w-3" />
        What does this mean?
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <p className="mt-2 text-sm text-gray-400 bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
          {explanation}
        </p>
      )}
    </div>
  );
}

export default function EmailHeaderAnalyzerPage() {
  const [rawHeaders, setRawHeaders] = useState('');
  const [result, setResult] = useState<HeaderAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleAnalyze = () => {
    if (!rawHeaders.trim()) return;
    setLoading(true);
    // Small timeout to let the UI update with the loading state
    setTimeout(() => {
      const analysis = analyzeEmailHeaders(rawHeaders);
      setResult(analysis);
      setLoading(false);
    }, 100);
  };

  const handleLoadSample = () => {
    setRawHeaders(SAMPLE_HEADERS);
    setResult(null);
  };

  return (
    <main className="bg-black">
      {/* Header */}
      <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <FileSearch className="h-10 w-10 text-violet-400" />
              <h1 className="text-4xl lg:text-5xl font-bold text-white font-display">
                Email Header <span className="text-violet-400">Analyzer</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Paste raw email headers to detect spoofing, phishing, and authentication failures.
              All analysis happens in your browser &mdash; nothing is sent to our servers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Input Card */}
          <Card className="bg-[#121212] border-white/10 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl font-bold font-display">
                    Paste Email Headers
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Paste the raw headers from a suspicious email to analyze
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                  className="border-white/10 text-violet-400 hover:bg-white/5 rounded-lg text-xs"
                >
                  {showHelp ? 'Hide' : 'How to get headers'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Help Instructions */}
              {showHelp && (
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 space-y-3">
                  {HELP_INSTRUCTIONS.map((item) => (
                    <div key={item.client}>
                      <span className="text-sm font-semibold text-violet-400">{item.client}:</span>{' '}
                      <span className="text-sm text-gray-300">{item.steps}</span>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                placeholder="Paste email headers here..."
                value={rawHeaders}
                onChange={(e) => setRawHeaders(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono text-sm resize-y"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadSample}
                  className="border-white/10 text-violet-400 hover:bg-white/5 rounded-lg text-xs"
                >
                  Load sample (suspicious email)
                </Button>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={loading || !rawHeaders.trim()}
                variant="accent"
                className="w-full py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Headers...
                  </>
                ) : (
                  <>
                    <FileSearch className="mr-2 h-5 w-5" />
                    Analyze Headers
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <>
              {/* Risk Overview */}
              <Card className="bg-[#121212] border-white/10 mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div
                      className={`flex-shrink-0 w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center ${getRiskBgColor(result.riskLevel)}`}
                    >
                      <span className={`text-4xl font-bold font-display ${getRiskColor(result.riskLevel)}`}>
                        {result.riskScore}
                      </span>
                      <span className={`text-sm font-semibold ${getRiskColor(result.riskLevel)}`}>
                        {result.riskLabel}
                      </span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-white font-display mb-2">
                        Analysis Complete
                      </h2>
                      <p className="text-gray-300 leading-relaxed">{result.summary}</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Badge className="bg-[#0A0A0A] border-white/10 text-gray-300 px-3 py-1">
                          {result.headers.length} headers parsed
                        </Badge>
                        <Badge className={`px-3 py-1 ${result.auth.verdictColor.replace('text-', 'bg-').replace('400', '500/20')} ${result.auth.verdictColor} border-transparent`}>
                          {result.auth.verdictLabel}
                        </Badge>
                        {result.sender.mismatches.length > 0 && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/50 px-3 py-1">
                            {result.sender.mismatches.length} sender issue{result.sender.mismatches.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {result.redFlags.length > 0 && (
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 px-3 py-1">
                            {result.redFlags.length} red flag{result.redFlags.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Authentication */}
              <Card className="bg-[#121212] border-white/10 mb-6">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-violet-400" />
                    <CardTitle className="text-white text-xl font-bold font-display">
                      Authentication Results
                    </CardTitle>
                    <Badge className={`${result.auth.verdictColor.replace('text-', 'bg-').replace('400', '500/20')} ${result.auth.verdictColor} border-transparent`}>
                      {result.auth.verdictLabel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[result.auth.spf, result.auth.dkim, result.auth.dmarc].map((check) => {
                    if (!check) return null;
                    const passed = check.result === 'pass';
                    const failed = check.result === 'fail';
                    return (
                      <div key={check.method} className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {passed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : failed ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            )}
                            <span className="text-white font-semibold uppercase">{check.method}</span>
                            {check.domain && (
                              <span className="text-sm text-gray-500">({check.domain})</span>
                            )}
                          </div>
                          <Badge
                            className={`${
                              passed
                                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                : failed
                                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            }`}
                          >
                            {check.result}
                          </Badge>
                        </div>
                        <CollapsibleExplanation explanation={check.explanation} />
                      </div>
                    );
                  })}
                  {!result.auth.spf && !result.auth.dkim && !result.auth.dmarc && (
                    <p className="text-gray-400">No Authentication-Results header found in these headers.</p>
                  )}
                </CardContent>
              </Card>

              {/* Sender Identity */}
              <Card className="bg-[#121212] border-white/10 mb-6">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Send className="h-6 w-6 text-violet-400" />
                    <CardTitle className="text-white text-xl font-bold font-display">
                      Sender Identity
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sender details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.sender.from && (
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">From</p>
                        {result.sender.from.name && (
                          <p className="text-sm text-white font-semibold">{result.sender.from.name}</p>
                        )}
                        <p className="text-sm text-violet-400 break-all">{result.sender.from.email}</p>
                      </div>
                    )}
                    {result.sender.replyTo && (
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reply-To</p>
                        <p className="text-sm text-violet-400 break-all">{result.sender.replyTo.email}</p>
                      </div>
                    )}
                    {result.sender.returnPath && (
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Return-Path</p>
                        <p className="text-sm text-violet-400 break-all">{result.sender.returnPath.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Mismatches */}
                  {result.sender.mismatches.length > 0 && (
                    <div className="space-y-3">
                      {result.sender.mismatches.map((m, i) => (
                        <Alert key={i} className="bg-red-500/10 border-red-500/50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <AlertDescription className="text-red-200">
                            <div className="flex items-center gap-2 mb-1">
                              <SeverityBadge severity={m.severity} />
                              <span className="font-semibold">{m.description}</span>
                            </div>
                            <CollapsibleExplanation explanation={m.explanation} />
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                  {result.sender.mismatches.length === 0 && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm">No sender identity mismatches detected</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Routing Path */}
              {result.routing.hops.length > 0 && (
                <Card className="bg-[#121212] border-white/10 mb-6">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-violet-400" />
                      <CardTitle className="text-white text-xl font-bold font-display">
                        Routing Path
                      </CardTitle>
                      <Badge className="bg-[#0A0A0A] border-white/10 text-gray-300">
                        {result.routing.totalHops} hop{result.routing.totalHops > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-0">
                      {result.routing.hops.map((hop) => (
                        <div key={hop.index} className="flex gap-4">
                          {/* Timeline line */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border-2 border-violet-500 flex items-center justify-center text-xs text-violet-400 font-bold flex-shrink-0">
                              {hop.index}
                            </div>
                            {hop.index < result.routing.hops.length && (
                              <div className="w-0.5 h-full bg-white/10 min-h-[2rem]" />
                            )}
                          </div>
                          {/* Hop content */}
                          <div className="pb-4 flex-1 min-w-0">
                            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                              {hop.from && (
                                <p className="text-sm text-gray-300">
                                  <span className="text-gray-500">from</span>{' '}
                                  <span className="text-white font-mono">{hop.from}</span>
                                </p>
                              )}
                              {hop.by && (
                                <p className="text-sm text-gray-300">
                                  <span className="text-gray-500">by</span>{' '}
                                  <span className="text-white font-mono">{hop.by}</span>
                                </p>
                              )}
                              {hop.ip && (
                                <p className="text-sm text-gray-300">
                                  <span className="text-gray-500">IP:</span>{' '}
                                  <span className="text-violet-400 font-mono">{hop.ip}</span>
                                </p>
                              )}
                              {hop.timestamp && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {hop.timestamp.toUTCString()}
                                </p>
                              )}
                              {hop.delay !== null && hop.delay > 0 && (
                                <p className={`text-xs mt-1 ${hop.delay > 30 * 60 * 1000 ? 'text-yellow-400' : 'text-gray-500'}`}>
                                  +{Math.round(hop.delay / 1000)}s from previous hop
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Routing flags */}
                    {result.routing.flags.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {result.routing.flags.map((flag, i) => (
                          <Alert key={i} className="bg-yellow-500/10 border-yellow-500/50 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-yellow-200">
                              <div className="flex items-center gap-2 mb-1">
                                <SeverityBadge severity={flag.severity} />
                                <span>{flag.description}</span>
                              </div>
                              <CollapsibleExplanation explanation={flag.explanation} />
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Red Flags */}
              {result.redFlags.length > 0 && (
                <Card className="bg-[#121212] border-white/10 mb-6">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Flag className="h-6 w-6 text-violet-400" />
                      <CardTitle className="text-white text-xl font-bold font-display">
                        Red Flags
                      </CardTitle>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                        {result.redFlags.length} found
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.redFlags.map((flag, i) => (
                      <div key={i} className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <SeverityBadge severity={flag.severity} />
                            <span className="text-white font-semibold text-sm">{flag.description}</span>
                          </div>
                          <code className="text-xs text-gray-500">{flag.header}</code>
                        </div>
                        {flag.value && (
                          <div className="bg-black rounded p-2 mb-2">
                            <code className="text-xs text-violet-400 break-all">{flag.value}</code>
                          </div>
                        )}
                        <CollapsibleExplanation explanation={flag.explanation} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

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
                        Want us to review your email security?
                      </h3>
                      <p className="text-gray-400">
                        Our team can configure SPF, DKIM, DMARC, and advanced email filtering to protect your
                        organization from phishing and spoofing attacks.
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
