import { Shield, Search, Lock, Brain, Zap, FileSearch } from 'lucide-react';
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
    'Vulnerability Assessment',
    'Incident Response',
    'Security Analysis',
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
        color: 'cesium',
    },
    {
        id: 'vuln-scanner',
        name: 'Vulnerability Scanner',
        tagline: 'Smart Security Assessment',
        description: 'AI-powered vulnerability scanning and assessment. Identify security weaknesses in your infrastructure with intelligent prioritization and remediation guidance.',
        icon: Search,
        category: 'Vulnerability Assessment',
        path: '/tools/vuln-scanner',
        features: [
            'Automated vulnerability detection',
            'Risk prioritization',
            'Remediation recommendations',
            'Compliance mapping',
        ],
        status: 'coming-soon',
        color: 'blue-500',
    },
    {
        id: 'incident-response',
        name: 'Incident Response Assistant',
        tagline: 'Rapid Threat Mitigation',
        description: 'AI-driven incident response playbooks and automated threat containment. Get step-by-step guidance for handling security incidents effectively.',
        icon: Zap,
        category: 'Incident Response',
        path: '/tools/incident-response',
        features: [
            'Automated playbooks',
            'Threat containment steps',
            'Evidence collection',
            'Timeline reconstruction',
        ],
        status: 'coming-soon',
        color: 'red-500',
    },
    {
        id: 'log-analyzer',
        name: 'Security Log Analyzer',
        tagline: 'Intelligent Log Analysis',
        description: 'Parse and analyze security logs using AI to detect anomalies, patterns, and potential threats. Support for multiple log formats and sources.',
        icon: FileSearch,
        category: 'Security Analysis',
        path: '/tools/log-analyzer',
        features: [
            'Multi-format log parsing',
            'Anomaly detection',
            'Pattern recognition',
            'Threat correlation',
        ],
        status: 'coming-soon',
        color: 'purple-500',
    },
    {
        id: 'compliance-checker',
        name: 'Compliance Checker',
        tagline: 'Automated Compliance Validation',
        description: 'Verify compliance with security frameworks like NIST, ISO 27001, SOC 2, and GDPR. Get AI-powered recommendations for meeting compliance requirements.',
        icon: Lock,
        category: 'Compliance',
        path: '/tools/compliance-checker',
        features: [
            'Multi-framework support',
            'Gap analysis',
            'Control mapping',
            'Audit preparation',
        ],
        status: 'coming-soon',
        color: 'green-500',
    },
    {
        id: 'security-advisor',
        name: 'Security Advisor',
        tagline: 'Expert Security Guidance',
        description: 'Chat with an AI security expert for personalized advice on security architecture, best practices, and threat mitigation strategies.',
        icon: Brain,
        category: 'Security Analysis',
        path: '/tools/security-advisor',
        features: [
            'Interactive AI chat',
            'Architecture review',
            'Best practice guidance',
            'Custom recommendations',
        ],
        status: 'coming-soon',
        color: 'yellow-500',
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
