export type FrameworkId = 'hipaa' | 'cmmc' | 'pci-dss';
export type Answer = 'yes' | 'partial' | 'no' | null;

export interface QuizQuestion {
  id: string;
  category: string;
  text: string;
  helpText?: string;
  weight: 1 | 2 | 3;
}

export interface Framework {
  id: FrameworkId;
  name: string;
  fullName: string;
  description: string;
  questions: QuizQuestion[];
}

export interface CategoryScore {
  category: string;
  score: number;
  answered: number;
  total: number;
}

export interface GapItem {
  question: QuizQuestion;
  answer: Answer;
}

export interface QuizResult {
  framework: FrameworkId;
  overallScore: number;
  status: 'Not Ready' | 'Partially Ready' | 'Ready for Audit';
  categoryScores: CategoryScore[];
  gaps: GapItem[];
  recommendations: string[];
}

export const frameworks: Framework[] = [
  {
    id: 'hipaa',
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    description:
      'Assess your readiness for HIPAA compliance, covering administrative, physical, and technical safeguards for protecting health information.',
    questions: [
      // Administrative Safeguards
      {
        id: 'hipaa-admin-1',
        category: 'Administrative Safeguards',
        text: 'Do you have a designated Security Officer responsible for HIPAA compliance?',
        weight: 3,
      },
      {
        id: 'hipaa-admin-2',
        category: 'Administrative Safeguards',
        text: 'Do you conduct regular risk assessments of your systems handling PHI?',
        helpText: 'PHI = Protected Health Information',
        weight: 3,
      },
      {
        id: 'hipaa-admin-3',
        category: 'Administrative Safeguards',
        text: 'Do all employees complete HIPAA security awareness training annually?',
        weight: 2,
      },
      {
        id: 'hipaa-admin-4',
        category: 'Administrative Safeguards',
        text: 'Do you have documented policies for handling security incidents involving PHI?',
        weight: 2,
      },
      {
        id: 'hipaa-admin-5',
        category: 'Administrative Safeguards',
        text: 'Do you maintain Business Associate Agreements (BAAs) with all vendors who access PHI?',
        weight: 3,
      },
      // Physical Safeguards
      {
        id: 'hipaa-phys-1',
        category: 'Physical Safeguards',
        text: 'Are workstations and devices accessing PHI in physically secured areas?',
        weight: 2,
      },
      {
        id: 'hipaa-phys-2',
        category: 'Physical Safeguards',
        text: 'Do you have policies for disposing of hardware and media containing PHI?',
        weight: 2,
      },
      {
        id: 'hipaa-phys-3',
        category: 'Physical Safeguards',
        text: 'Are facility access controls in place (badge readers, visitor logs)?',
        weight: 1,
      },
      {
        id: 'hipaa-phys-4',
        category: 'Physical Safeguards',
        text: 'Do you track and inventory all devices that store or access PHI?',
        weight: 2,
      },
      // Technical Safeguards
      {
        id: 'hipaa-tech-1',
        category: 'Technical Safeguards',
        text: 'Is access to PHI controlled with unique user IDs and role-based permissions?',
        weight: 3,
      },
      {
        id: 'hipaa-tech-2',
        category: 'Technical Safeguards',
        text: 'Is PHI encrypted both at rest and in transit?',
        weight: 3,
      },
      {
        id: 'hipaa-tech-3',
        category: 'Technical Safeguards',
        text: 'Do you maintain audit logs of who accesses PHI?',
        weight: 2,
      },
      {
        id: 'hipaa-tech-4',
        category: 'Technical Safeguards',
        text: 'Do you have automatic session timeouts on systems accessing PHI?',
        weight: 1,
      },
      {
        id: 'hipaa-tech-5',
        category: 'Technical Safeguards',
        text: 'Is multi-factor authentication (MFA) required for remote access to PHI?',
        weight: 3,
      },
      {
        id: 'hipaa-tech-6',
        category: 'Technical Safeguards',
        text: 'Do you have documented backup and disaster recovery procedures for PHI systems?',
        weight: 2,
      },
    ],
  },
  {
    id: 'cmmc',
    name: 'CMMC Level 1',
    fullName: 'Cybersecurity Maturity Model Certification',
    description:
      'Evaluate your organization against CMMC Level 1 requirements for protecting Federal Contract Information and Controlled Unclassified Information.',
    questions: [
      // Access Control
      {
        id: 'cmmc-ac-1',
        category: 'Access Control',
        text: 'Do you limit system access to authorized users only?',
        weight: 3,
      },
      {
        id: 'cmmc-ac-2',
        category: 'Access Control',
        text: 'Do you limit system access to the types of transactions and functions that authorized users are permitted to execute?',
        weight: 2,
      },
      {
        id: 'cmmc-ac-3',
        category: 'Access Control',
        text: 'Do you control the flow of CUI (Controlled Unclassified Information) in accordance with approved authorizations?',
        helpText:
          'CUI = Controlled Unclassified Information — sensitive government data that requires protection',
        weight: 2,
      },
      // Identification & Authentication
      {
        id: 'cmmc-ia-1',
        category: 'Identification & Authentication',
        text: 'Do you identify system users, processes acting on behalf of users, and devices?',
        weight: 3,
      },
      {
        id: 'cmmc-ia-2',
        category: 'Identification & Authentication',
        text: 'Do you verify the identities of users, processes, or devices before allowing system access?',
        weight: 3,
      },
      {
        id: 'cmmc-ia-3',
        category: 'Identification & Authentication',
        text: 'Do you use multi-factor authentication for local and network access?',
        weight: 2,
      },
      // Media & Physical Protection
      {
        id: 'cmmc-mp-1',
        category: 'Media & Physical Protection',
        text: 'Do you sanitize or destroy media containing Federal Contract Information before disposal?',
        weight: 2,
      },
      {
        id: 'cmmc-mp-2',
        category: 'Media & Physical Protection',
        text: 'Do you limit physical access to organizational systems and equipment to authorized individuals?',
        weight: 2,
      },
      {
        id: 'cmmc-mp-3',
        category: 'Media & Physical Protection',
        text: 'Do you escort visitors and monitor visitor activity?',
        weight: 1,
      },
      // System & Communications Protection and Integrity
      {
        id: 'cmmc-sc-1',
        category: 'System & Communications Protection and Integrity',
        text: 'Do you monitor, control, and protect communications at external boundaries and key internal boundaries?',
        weight: 3,
      },
      {
        id: 'cmmc-sc-2',
        category: 'System & Communications Protection and Integrity',
        text: 'Do you employ architectural designs, software development techniques, and systems engineering principles that promote effective information security?',
        weight: 2,
      },
      {
        id: 'cmmc-sc-3',
        category: 'System & Communications Protection and Integrity',
        text: 'Do you provide protection from malicious code (antivirus, endpoint detection) at appropriate locations?',
        weight: 3,
      },
    ],
  },
  {
    id: 'pci-dss',
    name: 'PCI-DSS',
    fullName: 'Payment Card Industry Data Security Standard',
    description:
      'Check your compliance posture against PCI-DSS requirements for organizations that handle credit card data and payment processing.',
    questions: [
      // Network Security
      {
        id: 'pci-net-1',
        category: 'Network Security',
        text: 'Do you have firewalls installed and configured to protect cardholder data?',
        weight: 3,
      },
      {
        id: 'pci-net-2',
        category: 'Network Security',
        text: 'Have you changed all vendor-supplied default passwords and security settings?',
        weight: 2,
      },
      {
        id: 'pci-net-3',
        category: 'Network Security',
        text: 'Do you segment your network to isolate cardholder data environments?',
        weight: 3,
      },
      // Cardholder Data
      {
        id: 'pci-data-1',
        category: 'Cardholder Data',
        text: 'Do you encrypt stored cardholder data using strong cryptography?',
        weight: 3,
      },
      {
        id: 'pci-data-2',
        category: 'Cardholder Data',
        text: 'Do you encrypt cardholder data when transmitted across open, public networks?',
        weight: 3,
      },
      // Vulnerability Management
      {
        id: 'pci-vuln-1',
        category: 'Vulnerability Management',
        text: 'Do you use and regularly update anti-virus software on all systems?',
        weight: 2,
      },
      {
        id: 'pci-vuln-2',
        category: 'Vulnerability Management',
        text: 'Do you develop and maintain secure systems and applications with regular patching?',
        weight: 2,
      },
      // Access Control
      {
        id: 'pci-ac-1',
        category: 'Access Control',
        text: 'Do you restrict access to cardholder data to only those with a business need?',
        weight: 3,
      },
      {
        id: 'pci-ac-2',
        category: 'Access Control',
        text: 'Do you assign unique IDs to each person with computer access?',
        weight: 2,
      },
      {
        id: 'pci-ac-3',
        category: 'Access Control',
        text: 'Do you restrict physical access to cardholder data?',
        weight: 2,
      },
      // Monitoring
      {
        id: 'pci-mon-1',
        category: 'Monitoring',
        text: 'Do you track and monitor all access to network resources and cardholder data?',
        weight: 3,
      },
      {
        id: 'pci-mon-2',
        category: 'Monitoring',
        text: 'Do you regularly test security systems and processes?',
        weight: 2,
      },
      // Policies
      {
        id: 'pci-pol-1',
        category: 'Policies',
        text: 'Do you maintain a policy that addresses information security for all personnel?',
        weight: 2,
      },
    ],
  },
];

function getAnswerScore(answer: Answer): number {
  if (answer === 'yes') return 1;
  if (answer === 'partial') return 0.5;
  return 0;
}

export function calculateResults(
  frameworkId: FrameworkId,
  answers: Record<string, Answer>
): QuizResult {
  const framework = frameworks.find((f) => f.id === frameworkId);
  if (!framework) {
    throw new Error(`Framework "${frameworkId}" not found`);
  }

  const { questions } = framework;

  // Calculate weighted overall score
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer !== null && answer !== undefined) {
      totalWeightedScore += getAnswerScore(answer) * question.weight;
      totalWeight += question.weight;
    }
  }

  const overallScore = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;

  // Calculate per-category scores
  const categoryMap = new Map<
    string,
    { weightedScore: number; totalWeight: number; answered: number; total: number }
  >();

  for (const question of questions) {
    if (!categoryMap.has(question.category)) {
      categoryMap.set(question.category, {
        weightedScore: 0,
        totalWeight: 0,
        answered: 0,
        total: 0,
      });
    }

    const cat = categoryMap.get(question.category)!;
    cat.total += 1;

    const answer = answers[question.id];
    if (answer !== null && answer !== undefined) {
      cat.weightedScore += getAnswerScore(answer) * question.weight;
      cat.totalWeight += question.weight;
      cat.answered += 1;
    }
  }

  const categoryScores: CategoryScore[] = [];
  for (const [category, data] of categoryMap) {
    categoryScores.push({
      category,
      score: data.totalWeight > 0 ? Math.round((data.weightedScore / data.totalWeight) * 100) : 0,
      answered: data.answered,
      total: data.total,
    });
  }

  // Determine status
  let status: QuizResult['status'];
  if (overallScore >= 80) {
    status = 'Ready for Audit';
  } else if (overallScore >= 40) {
    status = 'Partially Ready';
  } else {
    status = 'Not Ready';
  }

  // Identify gaps: questions answered "no" or "partial", sorted by weight descending
  const gaps: GapItem[] = [];
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === 'no' || answer === 'partial') {
      gaps.push({ question, answer });
    }
  }
  gaps.sort((a, b) => b.question.weight - a.question.weight);

  // Generate up to 5 recommendations from the highest-weight gaps
  const recommendations: string[] = [];
  for (const gap of gaps) {
    if (recommendations.length >= 5) break;
    // Simplify the question text for the recommendation
    let simplified = gap.question.text;
    // Remove leading "Do you " / "Are " / "Is " / "Have you " for cleaner phrasing
    simplified = simplified
      .replace(/^Do you have\s+/i, '')
      .replace(/^Do you\s+/i, '')
      .replace(/^Have you\s+/i, '')
      .replace(/^Are\s+/i, 'Ensure ')
      .replace(/^Is\s+/i, 'Ensure ');
    // Capitalize first letter
    simplified = simplified.charAt(0).toUpperCase() + simplified.slice(1);
    // Remove trailing question mark
    simplified = simplified.replace(/\?$/, '');
    recommendations.push(`Implement ${gap.question.category}: ${simplified}`);
  }

  return {
    framework: frameworkId,
    overallScore,
    status,
    categoryScores,
    gaps,
    recommendations,
  };
}
