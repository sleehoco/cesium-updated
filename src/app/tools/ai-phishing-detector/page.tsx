'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SafeMarkdown } from '@/components/shared/SafeMarkdown';
import { MessageSquare, AlertTriangle, Loader2, ShieldAlert } from 'lucide-react';
import EmailCaptureModal from '@/components/marketing/EmailCaptureModal';
import { useToolUsage } from '@/hooks/useToolUsage';

export default function PhishingDetectorPage() {
  const [content, setContent] = useState('');
  const [analysisType, setAnalysisType] = useState<'email' | 'url' | 'content'>('email');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Email capture integration
  const {
    shouldShowModal,
    trackUsage,
    markSignedUp,
    closeModal,
  } = useToolUsage('ai-phishing-detector');

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter content to analyze');
      return;
    }

    // Track tool usage for email capture modal
    trackUsage();

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze/phishing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          analysisType,
          sender: sender.trim() || undefined,
          subject: subject.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze content');
      }

      setResult(data.data.analysis);
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
          toolId: 'ai-phishing-detector',
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

  const loadSamplePhishing = () => {
    setAnalysisType('email');
    setSender('support@paypa1-secure.com');
    setSubject('Urgent: Verify Your Account');
    setContent(`Dear Valued Customer,

Your PayPal account has been temporarily suspended due to unusual activity.

To restore access, please verify your identity immediately by clicking the link below:

https://paypal-verify.secure-login.net/account/verify?id=98347234

You must complete verification within 24 hours or your account will be permanently closed.

If you don't verify, all funds will be frozen.

Click here to verify now: [VERIFY ACCOUNT]

Thank you for your cooperation.
PayPal Security Team

If you did not request this, please ignore this email.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <MessageSquare className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              AI Phishing Detector
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            AI-powered phishing detection and email security analysis
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-100">Content Input</CardTitle>
              <CardDescription className="text-slate-400">
                Enter email content, URL, or suspicious text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Analysis Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Analysis Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'email', label: 'Email', icon: '📧' },
                    { value: 'url', label: 'URL', icon: '🔗' },
                    { value: 'content', label: 'Text', icon: '📝' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setAnalysisType(type.value as typeof analysisType)}
                      className={`p-3 rounded-lg border transition-all ${
                        analysisType === type.value
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email-specific fields */}
              {analysisType === 'email' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="sender" className="text-sm font-medium text-slate-300">
                      Sender Email (Optional)
                    </label>
                    <input
                      id="sender"
                      type="email"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="e.g., support@suspicious-domain.com"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-slate-300">
                      Subject (Optional)
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Urgent: Verify your account"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </>
              )}

              {/* Content Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="content" className="text-sm font-medium text-slate-300">
                    {analysisType === 'email' ? 'Email Body' : analysisType === 'url' ? 'URL' : 'Content'}
                  </label>
                  <button
                    onClick={loadSamplePhishing}
                    className="text-xs text-orange-400 hover:text-orange-300"
                  >
                    Load Sample Phishing Email
                  </button>
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    analysisType === 'email'
                      ? 'Paste email content here...'
                      : analysisType === 'url'
                      ? 'Enter URL to analyze...'
                      : 'Enter suspicious text...'
                  }
                  rows={12}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Analyze for Phishing
                  </>
                )}
              </Button>

              {/* Warning Alert */}
              <Alert className="border-orange-500/50 bg-orange-500/10">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-orange-300 text-sm">
                  Never click links or download attachments from suspicious emails. This tool helps identify threats but cannot guarantee complete accuracy.
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
                Phishing risk assessment and indicators
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
                  <Loader2 className="h-12 w-12 text-orange-400 animate-spin mb-4" />
                  <p className="text-slate-400">Analyzing for phishing indicators...</p>
                  <p className="text-slate-500 text-sm mt-2">Checking for red flags</p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="text-center py-12 text-slate-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter content and click &quot;Analyze for Phishing&quot;</p>
                  <p className="text-sm mt-2">Or try the sample phishing email</p>
                </div>
              )}

              {result && (
                <div className="prose prose-invert prose-sm max-w-none">
                  <SafeMarkdown
                    content={result}
                    className="text-slate-300 [&>h1]:text-slate-100 [&>h2]:text-slate-200 [&>h3]:text-slate-300 [&>strong]:text-orange-400 [&>ul]:text-slate-300 [&>ol]:text-slate-300"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            { title: 'Email Analysis', desc: 'Detect phishing emails' },
            { title: 'URL Inspection', desc: 'Identify malicious links' },
            { title: 'Social Engineering', desc: 'Spot manipulation tactics' },
            { title: 'Sender Verification', desc: 'Validate email sources' },
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
          toolName="AI Phishing Detector"
        />
      </div>
    </div>
  );
}
