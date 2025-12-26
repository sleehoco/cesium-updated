'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SafeMarkdown } from '@/components/shared/SafeMarkdown';
import { Zap, AlertTriangle, Loader2, Clock } from 'lucide-react';
import EmailCaptureModal from '@/components/marketing/EmailCaptureModal';
import { useToolUsage } from '@/hooks/useToolUsage';

export default function IncidentResponsePage() {
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentType, setIncidentType] = useState<
    'malware' | 'ransomware' | 'data_breach' | 'phishing' | 'ddos' | 'unauthorized_access' | 'insider_threat' | 'general'
  >('general');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [affectedSystems, setAffectedSystems] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Email capture integration
  const {
    shouldShowModal,
    trackUsage,
    markSignedUp,
    closeModal,
  } = useToolUsage('incident-response');

  const handleGeneratePlaybook = async () => {
    if (!incidentDescription.trim()) {
      setError('Please describe the security incident');
      return;
    }

    // Track tool usage for email capture modal

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/incident/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incidentDescription: incidentDescription.trim(),
          incidentType,
          severity,
          affectedSystems: affectedSystems.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate incident response plan');
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
          toolId: 'incident-response',
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

  const loadSampleIncident = () => {
    setIncidentType('ransomware');
    setSeverity('critical');
    setAffectedSystems('File server, 20 workstations');
    setIncidentDescription(`Multiple workstations displaying ransomware notes demanding Bitcoin payment. Files encrypted with .locked extension. Ransom note indicates 72-hour deadline. File server also affected. Users reporting inability to access shared drives. No backups available for last 2 weeks.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Zap className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Incident Response Assistant
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            AI-powered incident response playbooks and threat mitigation guidance
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Incident Details</CardTitle>
              <CardDescription className="text-slate-400">
                Describe the security incident for response guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Incident Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Incident Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'general', label: 'General', icon: '🔍' },
                    { value: 'malware', label: 'Malware', icon: '🦠' },
                    { value: 'ransomware', label: 'Ransomware', icon: '🔒' },
                    { value: 'data_breach', label: 'Data Breach', icon: '💾' },
                    { value: 'phishing', label: 'Phishing', icon: '🎣' },
                    { value: 'ddos', label: 'DDoS', icon: '⚡' },
                    { value: 'unauthorized_access', label: 'Unauthorized Access', icon: '🚪' },
                    { value: 'insider_threat', label: 'Insider Threat', icon: '👤' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setIncidentType(type.value as typeof incidentType)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        incidentType === type.value
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-lg mr-1">{type.icon}</span>
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Severity Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'low', label: 'Low', color: 'blue' },
                    { value: 'medium', label: 'Medium', color: 'yellow' },
                    { value: 'high', label: 'High', color: 'orange' },
                    { value: 'critical', label: 'Critical', color: 'red' },
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSeverity(level.value as typeof severity)}
                      className={`p-2 rounded-lg border text-sm transition-all ${
                        severity === level.value
                          ? `border-${level.color}-500 bg-${level.color}-500/10 text-${level.color}-400`
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Affected Systems */}
              <div className="space-y-2">
                <label htmlFor="affectedSystems" className="text-sm font-medium text-slate-300">
                  Affected Systems (Optional)
                </label>
                <input
                  id="affectedSystems"
                  value={affectedSystems}
                  onChange={(e) => setAffectedSystems(e.target.value)}
                  placeholder="e.g., Web servers, Database, 50 workstations"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Incident Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="incidentDescription" className="text-sm font-medium text-slate-300">
                    Incident Description
                  </label>
                  <button
                    onClick={loadSampleIncident}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Load Sample Incident
                  </button>
                </div>
                <textarea
                  id="incidentDescription"
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  placeholder="Describe the security incident in detail... Include what happened, when it was detected, what systems are affected, and any other relevant information."
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGeneratePlaybook}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Playbook...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Response Plan
                  </>
                )}
              </Button>

              {/* Critical Alert */}
              <Alert className="border-red-500/50 bg-red-500/10">
                <Clock className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">
                  <strong>Time is critical!</strong> Follow containment steps immediately. This AI guidance complements but does not replace professional incident response teams.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-100">Response Playbook</CardTitle>
                {result && (
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    Plan Generated
                  </Badge>
                )}
              </div>
              <CardDescription className="text-slate-400">
                Step-by-step incident response guidance
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
                  <Loader2 className="h-12 w-12 text-red-400 animate-spin mb-4" />
                  <p className="text-slate-400">Generating incident response plan...</p>
                  <p className="text-slate-500 text-sm mt-2">Creating containment strategy</p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="text-center py-12 text-slate-500">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Describe the incident and click &quot;Generate Response Plan&quot;</p>
                  <p className="text-sm mt-2">Or load the sample ransomware incident</p>
                </div>
              )}

              {result && (
                <div className="prose prose-invert prose-sm max-w-none">
                  <SafeMarkdown
                    content={result}
                    className="text-slate-300 [&>h1]:text-slate-100 [&>h2]:text-slate-200 [&>h3]:text-slate-300 [&>strong]:text-red-400 [&>ul]:text-slate-300 [&>ol]:text-slate-300"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            { title: 'Automated Playbooks', desc: 'Step-by-step response guides' },
            { title: 'Containment Strategy', desc: 'Immediate threat mitigation' },
            { title: 'Evidence Collection', desc: 'Forensic preservation' },
            { title: 'Recovery Steps', desc: 'System restoration plan' },
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
          toolName="Incident Response Assistant"
        />
      </div>
    </div>
  );
}
