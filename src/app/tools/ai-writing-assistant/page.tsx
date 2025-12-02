'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PenTool, Loader2, CheckCircle2, Sparkles, Mail, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const modes = [
  {
    id: 'review',
    name: 'Review & Correct',
    description: 'Check grammar, spelling, and improve writing quality',
    icon: CheckCircle2,
    prompt: 'Please review the following text for grammar, spelling, punctuation, and clarity. Provide corrections and suggestions for improvement while maintaining the original intent and tone:\n\n',
  },
  {
    id: 'compose-email',
    name: 'Compose Email',
    description: 'Generate professional business emails from prompts',
    icon: Mail,
    prompt: 'Write a professional business email based on this request. Use appropriate business tone, proper formatting, and clear communication:\n\n',
  },
  {
    id: 'formalize',
    name: 'Make Professional',
    description: 'Transform casual text into formal business language',
    icon: FileText,
    prompt: 'Please rewrite the following text in a professional, formal business tone suitable for official communications:\n\n',
  },
];

export default function AIWritingAssistantPage() {
  const [mode, setMode] = useState(modes[0]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('/api/analyze/writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          mode: mode.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze text');
      }

      const data = await response.json();

      if (data.success && data.data.result) {
        setOutput(data.data.result);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyber-dark via-cyber to-cyber-light">
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <PenTool className="h-12 w-12 text-violet-500" />
              <h1 className="text-5xl lg:text-6xl font-bold text-white font-[var(--font-orbitron)]">
                AI Writing Assistant
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional business communication powered by AI. Review and correct grammar, compose emails,
              or transform casual text into formal business language.
            </p>
          </div>

          {/* Mode Selection */}
          <div className="mb-8">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              Select Mode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      mode.id === m.id
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-gray-700 bg-cyber-light/50 hover:border-violet-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-6 w-6 mt-1 ${mode.id === m.id ? 'text-violet-500' : 'text-gray-400'}`} />
                      <div>
                        <h3 className="text-white font-semibold mb-1">{m.name}</h3>
                        <p className="text-sm text-gray-400">{m.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Form */}
          <Card className="bg-cyber-light/50 border-violet-500/20 backdrop-blur-xl shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-white">Input Text</CardTitle>
              <CardDescription className="text-gray-400">
                {mode.id === 'compose-email'
                  ? 'Describe what you want the email to say (e.g., "Request a meeting with the client for next week")'
                  : 'Paste or type the text you want to analyze'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    mode.id === 'compose-email'
                      ? 'Example: "Write an email to thank the client for their business and request feedback on our recent project..."'
                      : 'Enter your text here...'
                  }
                  rows={8}
                  className="bg-cyber border-gray-700 text-white placeholder:text-gray-500 resize-none"
                />

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {mode.id === 'compose-email' ? 'Generate Email' : 'Analyze Text'}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="border-gray-700 text-gray-300 hover:bg-cyber-light"
                  >
                    Clear
                  </Button>
                </div>

                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Output */}
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-cyber-light/50 border-violet-500/20 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Result</CardTitle>
                      <CardDescription className="text-gray-400">
                        AI-generated output
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyOutput}
                      className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
                    >
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div className="bg-cyber p-6 rounded-lg border border-gray-700">
                      <ReactMarkdown className="text-gray-200">
                        {output}
                      </ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-cyber-light/30 border-violet-500/10">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" />
                  Grammar Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Paste any text to check for grammar, spelling, and punctuation errors with AI-powered corrections.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-cyber-light/30 border-violet-500/10">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-violet-500" />
                  Email Composition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Describe what you need and AI will generate a professional business email ready to send.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-cyber-light/30 border-violet-500/10">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-violet-500" />
                  Professionalize
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Transform informal text into polished, professional business language suitable for official use.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
