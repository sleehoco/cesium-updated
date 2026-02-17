/**
 * Client-Side Prompt Injection Analyzer
 * Runs pattern matching and scoring entirely in the browser
 */

import {
  attackPatterns,
  weaknessChecks,
  type Finding,
  type Severity,
} from './patterns';

export type AnalysisMode = 'system-prompt' | 'user-input';

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface AnalysisResult {
  grade: Grade;
  score: number; // 0–100 (100 = safest)
  findings: Finding[];
  summary: string;
}

// Severity weights for scoring
const SEVERITY_WEIGHTS: Record<Severity, number> = {
  critical: 40,
  high: 25,
  medium: 15,
  low: 5,
};

function scoreToGrade(score: number): Grade {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function gradeSummary(grade: Grade, mode: AnalysisMode, findingCount: number): string {
  if (findingCount === 0) {
    return mode === 'system-prompt'
      ? 'No known vulnerabilities detected. Your prompt follows good security practices.'
      : 'No injection patterns detected in this input.';
  }

  const modeLabel =
    mode === 'system-prompt' ? 'system prompt' : 'input';

  switch (grade) {
    case 'A':
      return `Your ${modeLabel} looks strong. Only minor observations found.`;
    case 'B':
      return `Your ${modeLabel} is mostly secure but has a few areas to harden.`;
    case 'C':
      return `Your ${modeLabel} has notable vulnerabilities that should be addressed.`;
    case 'D':
      return `Your ${modeLabel} has significant security gaps. Remediation recommended.`;
    case 'F':
      return `Your ${modeLabel} has critical vulnerabilities. Immediate action required.`;
  }
}

/**
 * Run client-side pattern analysis on the given text
 */
export function analyzeText(text: string, mode: AnalysisMode): AnalysisResult {
  const findings: Finding[] = [];
  const normalizedText = text.replace(/\r\n/g, '\n');

  // Run attack pattern detection
  for (const pattern of attackPatterns) {
    for (const regex of pattern.patterns) {
      const match = normalizedText.match(regex);
      if (match) {
        // Avoid duplicates for the same pattern definition
        if (!findings.some((f) => f.id === pattern.id)) {
          findings.push({
            id: pattern.id,
            category: pattern.category,
            name: pattern.name,
            severity: pattern.severity,
            description: pattern.description,
            fix: pattern.fix,
            matchedText: match[0],
            source: 'pattern',
          });
        }
        break; // One match per pattern definition is enough
      }
    }
  }

  // Run defensive weakness checks (only in system-prompt mode)
  if (mode === 'system-prompt') {
    for (const check of weaknessChecks) {
      if (check.test(normalizedText)) {
        findings.push({
          id: check.id,
          category: check.weakness,
          name: check.name,
          severity: check.severity,
          description: check.description,
          fix: check.fix,
          source: 'pattern',
        });
      }
    }
  }

  // Calculate score
  let penalty = 0;
  for (const finding of findings) {
    penalty += SEVERITY_WEIGHTS[finding.severity];
  }

  // Any critical finding = automatic F
  const hasCritical = findings.some((f) => f.severity === 'critical');
  const rawScore = Math.max(0, 100 - penalty);
  const score = hasCritical ? Math.min(rawScore, 35) : rawScore;
  const grade = scoreToGrade(score);

  // Sort findings by severity
  const severityOrder: Record<Severity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    grade,
    score,
    findings,
    summary: gradeSummary(grade, mode, findings.length),
  };
}

/**
 * Merge AI findings into existing pattern results.
 * AI can add new findings or adjust severity of existing ones.
 */
export function mergeAIFindings(
  patternResult: AnalysisResult,
  aiFindings: Finding[],
  mode: AnalysisMode
): AnalysisResult {
  const merged = [...patternResult.findings];

  for (const aiFinding of aiFindings) {
    const existing = merged.findIndex((f) => f.id === aiFinding.id);
    if (existing !== -1) {
      // AI overrides severity and description for existing findings
      merged[existing] = { ...merged[existing]!, ...aiFinding, source: 'ai' };
    } else {
      merged.push({ ...aiFinding, source: 'ai' });
    }
  }

  // Recalculate score with merged findings
  let penalty = 0;
  for (const finding of merged) {
    penalty += SEVERITY_WEIGHTS[finding.severity];
  }

  const hasCritical = merged.some((f) => f.severity === 'critical');
  const rawScore = Math.max(0, 100 - penalty);
  const score = hasCritical ? Math.min(rawScore, 35) : rawScore;
  const grade = scoreToGrade(score);

  const severityOrder: Record<Severity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  merged.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    grade,
    score,
    findings: merged,
    summary: gradeSummary(grade, mode, merged.length),
  };
}
