'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SafeMarkdown } from '@/components/shared/SafeMarkdown';
import { Search, AlertTriangle, Loader2 } from 'lucide-react';
import EmailCaptureModal from '@/components/marketing/EmailCaptureModal';
import { useToolUsage } from '@/hooks/useToolUsage';

export default function VulnerabilityScannerPage() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState<'network' | 'web' | 'code' | 'config' | 'general'>('general');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Email capture integration
  const {
    shouldShowModal,
    trackUsage,
    markSignedUp,
    closeModal,
  } = useToolUsage('vuln-scanner');

  const handleScan = async () => {
    if (!target.trim()) {
      setError('Please enter a target to scan');
      return;
    }

    // Track tool usage for email capture modal

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scan/vulnerability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: target.trim(),
          scanType,
          description: description.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze vulnerability');
      }

      setResult(data.data.analysis);

      // Track tool usage AFTER successful analysis (for email capture modal)
      trackUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Email capture submission handler
  const handleEmailSubmit = async (email: string, name: string) => {
    try {
      const response = await fetch('/api/marketing/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          toolId: 'vuln-scanner',
          source: 'tool-gate',
        }),
      });

      if (response.ok) {
        markSignedUp();
      }
    } catch (error) {
      console.error('Email capture failed:', error);
      throw error;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleScan();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Vulnerability Scanner
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            AI-powered vulnerability assessment and security analysis
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Scan Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Enter the target and configure your vulnerability scan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target Input */}
              <div className="space-y-2">
                <label htmlFor="target" className="text-sm font-medium text-slate-300">
                  Target
                </label>
                <input
                  id="target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., example.com, 192.168.1.1, or describe a system/configuration"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500">
                  Enter a domain, IP address, system description, or configuration details
                </p>
              </div>

              {/* Scan Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Scan Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'general', label: 'General', desc: 'General security assessment' },
                    { value: 'network', label: 'Network', desc: 'Network infrastructure' },
                    { value: 'web', label: 'Web App', desc: 'Web application' },
                    { value: 'code', label: 'Code', desc: 'Source code' },
                    { value: 'config', label: 'Config', desc: 'System configuration' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setScanType(type.value as typeof scanType)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        scanType === type.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs opacity-75">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Context */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-300">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide additional details about the target, environment, or specific concerns..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Scan Button */}
              <Button
                onClick={handleScan}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Start Scan
                  </>
                )}
              </Button>

              {/* Info Alert */}
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <AlertTriangle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300 text-sm">
                  This tool provides AI-powered security analysis and recommendations. For production systems, always conduct thorough manual testing and professional security audits.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-100">Analysis Results</CardTitle>
                {result && (
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    Scan Complete
                  </Badge>
                )}
              </div>
              <CardDescription className="text-slate-400">
                Vulnerability assessment and remediation guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4" />
                  <p className="text-slate-400">Analyzing vulnerabilities...</p>
                  <p className="text-slate-500 text-sm mt-2">This may take a moment</p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="text-center py-12 text-slate-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a target and click &quot;Start Scan&quot; to begin analysis</p>
                </div>
              )}

              {result && (
                <div className="prose prose-invert prose-sm max-w-none">
                  <SafeMarkdown
                    content={result}
                    className="text-slate-300 [&>h1]:text-slate-100 [&>h2]:text-slate-200 [&>h3]:text-slate-300 [&>strong]:text-blue-400 [&>ul]:text-slate-300 [&>ol]:text-slate-300"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            { title: 'AI-Powered', desc: 'Advanced vulnerability detection' },
            { title: 'Risk Prioritization', desc: 'Focus on critical issues first' },
            { title: 'Remediation Guide', desc: 'Step-by-step fix instructions' },
            { title: 'Compliance Mapping', desc: 'Framework alignment' },
          ].map((feature) => (
            <Card key={feature.title} className="border-slate-800 bg-slate-900/30 backdrop-blur">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-200 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Email capture modal */}
        <EmailCaptureModal
          isOpen={shouldShowModal}
          onClose={closeModal}
          onSubmit={handleEmailSubmit}
          toolName="Vulnerability Scanner"
        />
      </div>
    </div>
  );
}
