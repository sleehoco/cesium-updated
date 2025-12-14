'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { SafeMarkdown } from '@/components/shared/SafeMarkdown';

interface AnalysisResult {
  ioc: string;
  analysis: string;
  virusTotalData?: {
    type: string;
    stats: {
      malicious: number;
      suspicious: number;
      harmless: number;
      undetected: number;
    };
    summary: string;
  } | null;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export default function ThreatIntelPage() {
  const [ioc, setIoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!ioc.trim()) {
      setError('Please enter an IOC to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze/threat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ioc: ioc.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    { label: 'Suspicious IP', value: '185.220.101.34' },
    { label: 'Malicious Domain', value: 'malware-download.com' },
    { label: 'File Hash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyber-dark via-cyber to-black py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-cesium" />
            <h1 className="text-4xl lg:text-5xl font-black text-white font-[var(--font-orbitron)]">
              THREAT INTELLIGENCE <span className="text-cesium">ANALYZER</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered analysis of Indicators of Compromise (IOCs). Analyze IPs, domains, hashes, and URLs for threat intelligence.
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-cyber-light/40 border-2 border-cesium/20 backdrop-blur rounded-none mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-bold">Enter IOC</CardTitle>
            <CardDescription className="text-gray-400">
              Paste an IP address, domain, file hash, or URL to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 185.220.101.34 or malware-download.com"
              value={ioc}
              onChange={(e) => setIoc(e.target.value)}
              className="min-h-[100px] bg-cyber/50 border-cesium/30 text-white placeholder:text-gray-500 rounded-none font-mono"
              disabled={loading}
            />

            {/* Quick Examples */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Quick examples:</span>
              {examples.map((example) => (
                <Button
                  key={example.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setIoc(example.value)}
                  disabled={loading}
                  className="border-cesium/30 text-cesium hover:bg-cesium/10 rounded-none text-xs"
                >
                  {example.label}
                </Button>
              ))}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="bg-red-500/10 border-red-500/50 rounded-none">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={loading || !ioc.trim()}
              className="w-full bg-cesium hover:bg-cesium-dark text-black font-bold rounded-none py-6 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Analyze IOC
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card className="bg-cyber-light/40 border-2 border-cesium/30 backdrop-blur rounded-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Analysis Complete
                </CardTitle>
                <div className="text-xs text-gray-400">
                  Powered by <span className="text-cesium font-semibold">{result.provider}</span>
                </div>
              </div>
              <CardDescription className="text-gray-400 font-mono text-sm">
                IOC: {result.ioc}
              </CardDescription>

              {/* VirusTotal Badge */}
              {result.virusTotalData && (
                <div className="mt-4 p-4 bg-cyber/50 border-2 border-cesium/30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-cesium" />
                      VirusTotal Detection
                    </h3>
                    <span className="text-xs text-gray-400">Real-time threat intelligence</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="text-center p-2 bg-red-500/20 border border-red-500/50 rounded">
                      <div className="text-2xl font-bold text-red-400">{result.virusTotalData.stats.malicious}</div>
                      <div className="text-xs text-gray-400">Malicious</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-500/20 border border-yellow-500/50 rounded">
                      <div className="text-2xl font-bold text-yellow-400">{result.virusTotalData.stats.suspicious}</div>
                      <div className="text-xs text-gray-400">Suspicious</div>
                    </div>
                    <div className="text-center p-2 bg-green-500/20 border border-green-500/50 rounded">
                      <div className="text-2xl font-bold text-green-400">{result.virusTotalData.stats.harmless}</div>
                      <div className="text-xs text-gray-400">Harmless</div>
                    </div>
                    <div className="text-center p-2 bg-gray-500/20 border border-gray-500/50 rounded">
                      <div className="text-2xl font-bold text-gray-400">{result.virusTotalData.stats.undetected}</div>
                      <div className="text-xs text-gray-400">Undetected</div>
                    </div>
                  </div>

                  {/* Threat Level Indicator */}
                  <div className="mt-3">
                    {result.virusTotalData.stats.malicious > 0 ? (
                      <Alert className="bg-red-500/10 border-red-500/50 rounded-none">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-200">
                          <strong>MALICIOUS:</strong> {result.virusTotalData.stats.malicious} security vendors detected this IOC as malicious
                        </AlertDescription>
                      </Alert>
                    ) : result.virusTotalData.stats.suspicious > 0 ? (
                      <Alert className="bg-yellow-500/10 border-yellow-500/50 rounded-none">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <AlertDescription className="text-yellow-200">
                          <strong>SUSPICIOUS:</strong> {result.virusTotalData.stats.suspicious} security vendors flagged this as suspicious
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-green-500/10 border-green-500/50 rounded-none">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-200">
                          <strong>CLEAN:</strong> No security vendors flagged this IOC as malicious
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* AI Analysis */}
              <div className="prose prose-invert prose-cesium max-w-none">
                <div className="bg-cyber/50 p-6 rounded border border-cesium/20">
                  <SafeMarkdown
                    content={result.analysis}
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold text-cesium mb-2">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-300">{children}</li>,
                      strong: ({ children }) => <strong className="text-cesium font-bold">{children}</strong>,
                      code: ({ children }) => (
                        <code className="bg-black/50 px-2 py-1 rounded text-cesium font-mono text-sm">{children}</code>
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Usage Stats */}
              {result.usage && (
                <div className="mt-6 pt-6 border-t border-cesium/20">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Info className="h-4 w-4" />
                    <span>
                      Tokens: {result.usage.totalTokens} (Prompt: {result.usage.promptTokens}, Completion:{' '}
                      {result.usage.completionTokens})
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-cesium/10 border-cesium/30 backdrop-blur rounded-none">
            <CardHeader>
              <CardTitle className="text-white text-lg">Supported IOCs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• IP Addresses (IPv4/IPv6)</li>
                <li>• Domain Names</li>
                <li>• File Hashes (MD5, SHA1, SHA256)</li>
                <li>• URLs</li>
                <li>• Email Addresses</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-cesium/10 border-cesium/30 backdrop-blur rounded-none">
            <CardHeader>
              <CardTitle className="text-white text-lg">Analysis Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Threat Level Assessment</li>
                <li>• Known Associations</li>
                <li>• Malware Family Detection</li>
                <li>• Threat Actor Attribution</li>
                <li>• Recommended Actions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-cesium/10 border-cesium/30 backdrop-blur rounded-none">
            <CardHeader>
              <CardTitle className="text-white text-lg">Powered By AI</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Real-time Analysis</li>
                <li>• Expert-Level Insights</li>
                <li>• Actionable Recommendations</li>
                <li>• Context-Aware Assessment</li>
                <li>• Continuously Updated</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
