'use client';

import { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  frameworks,
  calculateResults,
  type FrameworkId,
  type Answer,
  type QuizResult,
} from '@/lib/compliance/quiz-data';
import Link from 'next/link';

export default function ComplianceQuizPage() {
  const [selectedFramework, setSelectedFramework] = useState<FrameworkId | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showResults, setShowResults] = useState(false);

  const framework = useMemo(
    () => frameworks.find((f) => f.id === selectedFramework) ?? null,
    [selectedFramework]
  );

  const questions = useMemo(() => framework?.questions ?? [], [framework]);
  const totalQuestions = questions.length;
  const question = questions[currentQuestion] ?? null;

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id] !== null && answers[q.id] !== undefined).length,
    [questions, answers]
  );

  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  const completionPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Live running score calculated on the fly
  const liveScore = useMemo(() => {
    if (!selectedFramework || answeredCount === 0) return 0;
    const result = calculateResults(selectedFramework, answers);
    return result.overallScore;
  }, [selectedFramework, answers, answeredCount]);

  const results: QuizResult | null = useMemo(() => {
    if (!showResults || !selectedFramework) return null;
    return calculateResults(selectedFramework, answers);
  }, [showResults, selectedFramework, answers]);

  function handleSelectFramework(id: FrameworkId) {
    setSelectedFramework(id);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  }

  function handleAnswer(answer: Answer) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
  }

  function handleNext() {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }

  function handleShowResults() {
    setShowResults(true);
  }

  function handleStartOver() {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  }

  function handleTryAnother() {
    setSelectedFramework(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  }

  function getScoreColor(score: number): string {
    if (score < 40) return 'text-red-400';
    if (score < 80) return 'text-yellow-400';
    return 'text-green-400';
  }

  function getScoreBarColor(score: number): string {
    if (score < 40) return 'bg-red-500';
    if (score < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  function getStatusIcon(status: string) {
    if (status === 'Ready for Audit') return <CheckCircle2 className="h-8 w-8 text-green-400" />;
    if (status === 'Partially Ready') return <AlertTriangle className="h-8 w-8 text-yellow-400" />;
    return <XCircle className="h-8 w-8 text-red-400" />;
  }

  function getWeightLabel(weight: number): string {
    if (weight === 3) return 'High';
    if (weight === 2) return 'Medium';
    return 'Low';
  }

  function getWeightBadgeClasses(weight: number): string {
    if (weight === 3) return 'border-red-500/50 text-red-400 bg-red-500/10';
    if (weight === 2) return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10';
    return 'border-gray-500/50 text-gray-400 bg-gray-500/10';
  }

  // ---------- Screen 1: Framework Selection ----------
  if (!selectedFramework) {
    return (
      <main className="bg-navy-950">
        <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <ClipboardCheck className="h-10 w-10 text-sky-400" />
                <h1 className="text-4xl lg:text-5xl font-bold text-white font-display">
                  Compliance Readiness <span className="text-sky-400">Quiz</span>
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Assess your organization&apos;s compliance readiness across major regulatory
                frameworks. Answer a few questions to identify gaps and get actionable
                recommendations.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 pb-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              {frameworks.map((fw) => (
                <Card
                  key={fw.id}
                  className="bg-navy-800 border-navy-700 hover:border-sky-500/30 transition-all duration-300 flex flex-col"
                >
                  <CardHeader>
                    <CardTitle className="text-white text-2xl font-display mb-1">
                      {fw.name}
                    </CardTitle>
                    <p className="text-sky-400 text-sm font-semibold">{fw.fullName}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {fw.description}
                      </p>
                      <p className="text-gray-400 text-sm mb-6">{fw.questions.length} questions</p>
                    </div>
                    <Button
                      variant="accent"
                      className="w-full"
                      onClick={() => handleSelectFramework(fw.id)}
                    >
                      Start Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------- Screen 3: Results ----------
  if (showResults && results && framework) {
    return (
      <main className="bg-navy-950">
        <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold text-white font-display">
                {framework.name} <span className="text-sky-400">Results</span>
              </h1>
            </div>
          </div>
        </section>

        <section className="py-12 pb-24">
          <div className="container mx-auto px-4 max-w-4xl space-y-8">
            {/* Overall Score */}
            <Card className="bg-navy-800 border-navy-700">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center py-6">
                  {getStatusIcon(results.status)}
                  <p
                    className={`text-6xl font-bold mt-4 ${getScoreColor(results.overallScore)}`}
                  >
                    {results.overallScore}%
                  </p>
                  <p
                    className={`text-xl font-semibold mt-2 ${getScoreColor(results.overallScore)}`}
                  >
                    {results.status}
                  </p>
                  <p className="text-gray-400 text-sm mt-2 max-w-md">
                    {results.status === 'Ready for Audit' &&
                      'Your organization shows strong compliance readiness. Consider a formal audit to confirm.'}
                    {results.status === 'Partially Ready' &&
                      'You have a foundation in place but there are gaps to address before pursuing an audit.'}
                    {results.status === 'Not Ready' &&
                      'Significant gaps exist in your compliance posture. Prioritize the recommendations below.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="bg-navy-800 border-navy-700">
              <CardHeader>
                <CardTitle className="text-white text-lg font-display">
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.categoryScores.map((cat) => (
                    <div
                      key={cat.category}
                      className="bg-navy-900 border border-navy-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white text-sm font-semibold">{cat.category}</p>
                        <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>
                          {cat.score}%
                        </span>
                      </div>
                      <Progress
                        value={cat.score}
                        className="h-2 mb-2"
                        indicatorClassName={getScoreBarColor(cat.score)}
                      />
                      <p className="text-gray-400 text-xs">
                        {cat.answered} of {cat.total} questions
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gaps */}
            {results.gaps.length > 0 && (
              <Card className="bg-navy-800 border-navy-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-display">Priority Gaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.gaps.map((gap) => (
                      <div
                        key={gap.question.id}
                        className="bg-navy-900 border border-navy-700 rounded-lg p-4 flex items-start gap-4"
                      >
                        <Badge
                          variant="outline"
                          className={`shrink-0 mt-0.5 ${getWeightBadgeClasses(gap.question.weight)}`}
                        >
                          {getWeightLabel(gap.question.weight)}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{gap.question.text}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-gray-500 text-xs">{gap.question.category}</span>
                            <span className="text-gray-600 text-xs">|</span>
                            <span
                              className={`text-xs font-medium ${
                                gap.answer === 'no' ? 'text-red-400' : 'text-yellow-400'
                              }`}
                            >
                              {gap.answer === 'no' ? 'No' : 'Partial'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {results.recommendations.length > 0 && (
              <Card className="bg-navy-800 border-navy-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-display">
                    Top Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 border-navy-700 text-gray-300 hover:bg-navy-800 hover:text-white"
                onClick={handleStartOver}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-navy-700 text-gray-300 hover:bg-navy-800 hover:text-white"
                onClick={handleTryAnother}
              >
                Try Another Framework
              </Button>
            </div>

            {/* Lead CTA */}
            <Card className="bg-navy-800 border-navy-700 mt-4">
              <CardContent className="pt-6 text-center">
                <h2 className="text-2xl font-bold text-white font-display mb-3">
                  Want a detailed <span className="text-sky-400">compliance assessment</span>?
                </h2>
                <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                  Our experts conduct thorough compliance audits with detailed remediation roadmaps
                  tailored to your organization.
                </p>
                <Link href="/contact?service=security-audit">
                  <Button variant="accent" className="px-8 py-6 text-lg">
                    <Shield className="mr-2 h-5 w-5" />
                    Get a Compliance Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  // ---------- Screen 2: Quiz Interface ----------
  if (!question || !framework) return null;

  const currentAnswer = answers[question.id] ?? null;

  return (
    <main className="bg-navy-950">
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-white font-display">
              {framework.name} <span className="text-sky-400">Assessment</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="bg-navy-800 border-navy-700">
            <CardContent className="pt-6">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">
                    {completionPercent}% complete
                  </span>
                  <span className="text-gray-400 text-sm">
                    {answeredCount} / {totalQuestions} answered
                  </span>
                </div>
                <Progress
                  value={completionPercent}
                  className="h-2"
                  indicatorClassName="bg-sky-500"
                />
              </div>

              {/* Live score display */}
              {answeredCount > 0 && (
                <div className="flex items-center justify-center gap-2 mb-6 py-3 bg-navy-900 rounded-lg border border-navy-700">
                  <span className="text-gray-400 text-sm">Running Score:</span>
                  <span className={`text-2xl font-bold ${getScoreColor(liveScore)}`}>
                    {liveScore}%
                  </span>
                </div>
              )}

              {/* Category badge */}
              <div className="mb-4">
                <Badge
                  variant="outline"
                  className="border-sky-500/50 text-sky-400 bg-sky-500/10"
                >
                  {question.category}
                </Badge>
              </div>

              {/* Question text */}
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-2 leading-snug">
                {question.text}
              </h2>

              {/* Help text */}
              {question.helpText && (
                <p className="text-gray-400 text-sm mb-6">{question.helpText}</p>
              )}
              {!question.helpText && <div className="mb-6" />}

              {/* Answer buttons */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => handleAnswer('yes')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-all duration-200 ${
                    currentAnswer === 'yes'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-400'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer('partial')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-all duration-200 ${
                    currentAnswer === 'partial'
                      ? 'bg-yellow-500 border-yellow-500 text-white'
                      : 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30 text-yellow-400'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Partial
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer('no')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-all duration-200 ${
                    currentAnswer === 'no'
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-400'
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  No
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="border-navy-700 text-gray-300 hover:bg-navy-700 hover:text-white"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-3">
                  {allAnswered && (
                    <Button variant="accent" onClick={handleShowResults}>
                      See Results
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {!allAnswered && (
                    <Button
                      variant="outline"
                      className="border-navy-700 text-gray-300 hover:bg-navy-700 hover:text-white"
                      onClick={handleNext}
                      disabled={currentQuestion === totalQuestions - 1}
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Question dots navigation */}
              <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
                {questions.map((q, idx) => {
                  const a = answers[q.id];
                  let dotColor = 'bg-navy-700';
                  if (a === 'yes') dotColor = 'bg-green-500';
                  else if (a === 'partial') dotColor = 'bg-yellow-500';
                  else if (a === 'no') dotColor = 'bg-red-500';

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${dotColor} ${
                        idx === currentQuestion ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-navy-800' : ''
                      }`}
                      aria-label={`Go to question ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
