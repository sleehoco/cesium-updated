'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SafeMarkdown } from '@/components/shared/SafeMarkdown';
import { FileSearch, AlertTriangle, Loader2, Info } from 'lucide-react';

export default function LogAnalyzerPage() {
  const [logs, setLogs] = useState('');
  const [logSource, setLogSource] = useState('');
  const [focusArea, setFocusArea] = useState<'all' | 'authentication' | 'network' | 'application' | 'system'>('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!logs.trim()) {
      setError('Please paste security logs to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logs.trim(),
          logSource: logSource.trim() || undefined,
          focusArea,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze logs');
      }

      setResult(data.data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleLogs = () => {
    setLogs(`[2024-01-15 14:32:15] AUTH: Failed login attempt for user 'admin' from IP 192.168.1.100
[2024-01-15 14:32:18] AUTH: Failed login attempt for user 'admin' from IP 192.168.1.100
[2024-01-15 14:32:22] AUTH: Failed login attempt for user 'admin' from IP 192.168.1.100
[2024-01-15 14:32:25] AUTH: Failed login attempt for user 'root' from IP 192.168.1.100
[2024-01-15 14:32:28] AUTH: Failed login attempt for user 'root' from IP 192.168.1.100
[2024-01-15 14:32:31] FW: Blocked connection attempt from 192.168.1.100 to port 22
[2024-01-15 14:33:45] AUTH: Successful login for user 'jsmith' from IP 10.0.0.50
[2024-01-15 14:35:12] APP: Unusual API request volume detected from user 'jsmith'
[2024-01-15 14:35:45] APP: Multiple 403 errors for user 'jsmith' accessing /admin endpoint`);
    setLogSource('Firewall + Application Logs');
    setFocusArea('authentication');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <FileSearch className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Security Log Analyzer
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            AI-powered security log analysis for threat detection and anomaly identification
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Log Input</CardTitle>
              <CardDescription className="text-slate-400">
                Paste your security logs for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Log Source */}
              <div className="space-y-2">
                <label htmlFor="logSource" className="text-sm font-medium text-slate-300">
                  Log Source (Optional)
                </label>
                <input
                  id="logSource"
                  value={logSource}
                  onChange={(e) => setLogSource(e.target.value)}
                  placeholder="e.g., Windows Event Log, Syslog, Apache, Firewall"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Focus Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Focus Area
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'All Areas' },
                    { value: 'authentication', label: 'Authentication' },
                    { value: 'network', label: 'Network' },
                    { value: 'application', label: 'Application' },
                    { value: 'system', label: 'System' },
                  ].map((area) => (
                    <button
                      key={area.value}
                      onClick={() => setFocusArea(area.value as typeof focusArea)}
                      className={`p-2 rounded-lg border text-sm transition-all ${
                        focusArea === area.value
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logs Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="logs" className="text-sm font-medium text-slate-300">
                    Security Logs
                  </label>
                  <button
                    onClick={loadSampleLogs}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Load Sample Logs
                  </button>
                </div>
                <textarea
                  id="logs"
                  value={logs}
                  onChange={(e) => setLogs(e.target.value)}
                  placeholder="Paste your security logs here...&#10;&#10;Example:&#10;[2024-01-15 14:32:15] Failed login for user 'admin' from 192.168.1.100&#10;[2024-01-15 14:32:18] Firewall blocked connection from 10.0.0.50"
                  rows={12}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                />
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileSearch className="mr-2 h-4 w-4" />
                    Analyze Logs
                  </>
                )}
              </Button>

              {/* Info Alert */}
              <Alert className="border-purple-500/50 bg-purple-500/10">
                <Info className="h-4 w-4 text-purple-400" />
                <AlertDescription className="text-purple-300 text-sm">
                  This tool analyzes logs for security threats and anomalies. Remove sensitive data before uploading.
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
                    Analysis Complete
                  </Badge>
                )}
              </div>
              <CardDescription className="text-slate-400">
                Security findings and recommendations
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
                  <Loader2 className="h-12 w-12 text-purple-400 animate-spin mb-4" />
                  <p className="text-slate-400">Analyzing security logs...</p>
                  <p className="text-slate-500 text-sm mt-2">Detecting threats and anomalies</p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="text-center py-12 text-slate-500">
                  <FileSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Paste your logs and click &quot;Analyze Logs&quot; to begin</p>
                  <p className="text-sm mt-2">Or try the sample logs to see how it works</p>
                </div>
              )}

              {result && (
                <div className="prose prose-invert prose-sm max-w-none">
                  <SafeMarkdown
                    content={result}
                    className="text-slate-300 [&>h1]:text-slate-100 [&>h2]:text-slate-200 [&>h3]:text-slate-300 [&>strong]:text-purple-400 [&>ul]:text-slate-300 [&>ol]:text-slate-300"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            { title: 'Multi-Format Support', desc: 'Parse various log formats' },
            { title: 'Anomaly Detection', desc: 'Identify unusual patterns' },
            { title: 'Threat Correlation', desc: 'Connect related events' },
            { title: 'Prioritized Findings', desc: 'Critical issues first' },
          ].map((feature) => (
            <Card key={feature.title} className="border-slate-800 bg-slate-900/30 backdrop-blur">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-200 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
