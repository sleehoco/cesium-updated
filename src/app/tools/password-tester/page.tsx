'use client';

import { useState } from 'react';
import { KeyRound, Lock, Check, X, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { analyzePassword } from '@/lib/password-analyzer';
import Link from 'next/link';

export default function PasswordTesterPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const analysis = analyzePassword(password);

  function getScoreColor(score: number): string {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  function getScoreTextColor(score: number): string {
    if (score < 40) return 'text-red-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-green-400';
  }

  return (
    <main className="bg-black">
      {/* Header */}
      <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <KeyRound className="h-10 w-10 text-violet-400" />
              <h1 className="text-4xl lg:text-5xl font-bold text-white font-display">
                Password Strength <span className="text-violet-400">Tester</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Test how strong your passwords really are. Get real-time feedback on strength, crack
              time estimates, and specific improvement suggestions.
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <Lock className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm font-medium">
                Your password never leaves your browser — all analysis happens locally in JavaScript
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Password Input Card */}
          <Card className="bg-[#121212] border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl font-bold font-display">
                Enter a Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type a password to test..."
                  className="w-full px-4 py-3 pr-12 bg-[#0A0A0A] border border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {password.length > 0 && (
            <div className="space-y-6">
              {/* Score Bar */}
              <Card className="bg-[#121212] border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-300 font-medium">Password Strength</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${getScoreTextColor(analysis.score)}`}>
                        {analysis.score}
                      </span>
                      <span className={`text-sm font-semibold ${getScoreTextColor(analysis.score)}`}>
                        {analysis.strength}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={analysis.score}
                    indicatorClassName={getScoreColor(analysis.score)}
                  />
                </CardContent>
              </Card>

              {/* Character Analysis Grid */}
              <Card className="bg-[#121212] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-display">
                    Character Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Length */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Length</p>
                      <p className="text-2xl font-bold text-white">
                        {analysis.characterAnalysis.length}
                      </p>
                    </div>

                    {/* Uppercase */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Uppercase
                      </p>
                      {analysis.characterAnalysis.hasUppercase ? (
                        <Check className="h-6 w-6 text-green-400 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-red-400 mx-auto" />
                      )}
                    </div>

                    {/* Lowercase */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Lowercase
                      </p>
                      {analysis.characterAnalysis.hasLowercase ? (
                        <Check className="h-6 w-6 text-green-400 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-red-400 mx-auto" />
                      )}
                    </div>

                    {/* Numbers */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Numbers
                      </p>
                      {analysis.characterAnalysis.hasNumbers ? (
                        <Check className="h-6 w-6 text-green-400 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-red-400 mx-auto" />
                      )}
                    </div>

                    {/* Symbols */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Symbols
                      </p>
                      {analysis.characterAnalysis.hasSymbols ? (
                        <Check className="h-6 w-6 text-green-400 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-red-400 mx-auto" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crack Time Estimates */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-[#0A0A0A] border-white/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-violet-400" />
                      <h3 className="text-white font-semibold">Brute Force Attack</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      10 billion guesses/sec (GPU cluster)
                    </p>
                    <p className={`text-xl font-bold ${getScoreTextColor(analysis.score)}`}>
                      {analysis.crackTimes.bruteForce}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#0A0A0A] border-white/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-violet-400" />
                      <h3 className="text-white font-semibold">Dictionary Attack</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      1 million guesses/sec (rule-based)
                    </p>
                    <p className={`text-xl font-bold ${getScoreTextColor(analysis.score)}`}>
                      {analysis.crackTimes.dictionary}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Pattern Warnings */}
              {analysis.patterns.length > 0 && (
                <div className="space-y-3">
                  {analysis.patterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg border border-red-500/30 bg-red-500/10"
                    >
                      <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-200 text-sm">{pattern}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Improvement Suggestions */}
              {analysis.suggestions.length > 0 && (
                <Card className="bg-[#121212] border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg font-display">
                      Improvement Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Lead CTA Section */}
          <Card className="bg-[#121212] border-white/10 mt-12">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold text-white font-display mb-3">
                Your employees probably use <span className="text-violet-400">worse passwords</span>
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                A security assessment identifies weak authentication across your entire organization
                — before attackers do.
              </p>
              <Link href="/contact?service=security-assessment">
                <Button variant="accent" className="px-8 py-6 text-lg">
                  <Shield className="mr-2 h-5 w-5" />
                  Get a Security Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
