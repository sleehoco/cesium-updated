import { Shield, KeyRound, Mail, Globe, ClipboardCheck } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Tool {
    id: string;
    name: string;
    tagline: string;
    description: string;
    icon: LucideIcon;
    category: string;
    path: string;
    features: string[];
    status?: 'new' | 'beta' | 'coming-soon';
    color: string; // Tailwind color class
}

export const toolCategories = [
    'All Tools',
    'Threat Intelligence',
    'Authentication',
    'Email Security',
    'Web Security',
    'Compliance',
] as const;

export const tools: Tool[] = [
    {
        id: 'threat-intel',
        name: 'Threat Intelligence Analyzer',
        tagline: 'AI-Powered IOC Analysis',
        description: 'Analyze Indicators of Compromise (IOCs) using advanced AI models. Get real-time threat intelligence on IPs, domains, hashes, and URLs with VirusTotal integration.',
        icon: Shield,
        category: 'Threat Intelligence',
        path: '/tools/threat-intel',
        features: [
            'Real-time IOC analysis',
            'VirusTotal integration',
            'Threat level assessment',
            'Malware family detection',
        ],
        color: 'sky-500',
    },
    {
        id: 'password-tester',
        name: 'Password Strength Tester',
        tagline: 'Instant Password Analysis',
        description: 'Test how strong your passwords really are. Get real-time feedback on password strength, crack time estimates, and specific improvement suggestions — all without leaving your browser.',
        icon: KeyRound,
        category: 'Authentication',
        path: '/tools/password-tester',
        features: [
            '100% client-side — nothing sent to servers',
            'Real-time strength scoring',
            'Crack time estimation',
            'Pattern & dictionary detection',
        ],
        status: 'new',
        color: 'teal-500',
    },
    {
        id: 'email-security',
        name: 'Email Security Checker',
        tagline: 'SPF, DKIM & DMARC Analysis',
        description: 'Check if your domain is properly configured to prevent email spoofing and phishing. Analyze SPF, DKIM, and DMARC records with plain-English explanations.',
        icon: Mail,
        category: 'Email Security',
        path: '/tools/email-security',
        features: [
            'SPF record validation',
            'DMARC policy analysis',
            'DKIM selector detection',
            'A-F security grading',
        ],
        status: 'new',
        color: 'blue-500',
    },
    {
        id: 'headers-scanner',
        name: 'Website Security Headers Scanner',
        tagline: 'HTTP Security Header Analysis',
        description: 'Scan any website to see if it has the right security headers in place. Check for Content-Security-Policy, HSTS, and 5 other critical headers with remediation guidance.',
        icon: Globe,
        category: 'Web Security',
        path: '/tools/headers-scanner',
        features: [
            '7 security headers checked',
            'Weighted scoring (A-F grade)',
            'Recommended header values',
            'One-click scan',
        ],
        status: 'new',
        color: 'purple-500',
    },
    {
        id: 'compliance-quiz',
        name: 'Compliance Readiness Quiz',
        tagline: 'HIPAA, CMMC & PCI-DSS Assessment',
        description: 'Find out how ready your organization is for a compliance audit. Answer targeted questions across HIPAA, CMMC Level 1, or PCI-DSS and get a readiness score with prioritized gaps.',
        icon: ClipboardCheck,
        category: 'Compliance',
        path: '/tools/compliance-quiz',
        features: [
            '3 compliance frameworks',
            'Per-category scoring breakdown',
            'Gap analysis with priorities',
            'Actionable recommendations',
        ],
        status: 'new',
        color: 'green-500',
    },
];

export function getToolById(id: string): Tool | undefined {
    return tools.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: string): Tool[] {
    if (category === 'All Tools') {
        return tools;
    }
    return tools.filter((tool) => tool.category === category);
}
