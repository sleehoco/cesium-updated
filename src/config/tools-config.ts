import { Shield, Search, Lock, Brain, Zap, FileSearch, Bot, MessageSquare, Code, Network } from 'lucide-react';
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
    'AI Security Tools',
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
        category: 'AI Security Tools',
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
    {
        id: 'ai-threat-hunter',
        name: 'AI Threat Hunter',
        tagline: 'Autonomous Threat Detection',
        description: 'Advanced AI-powered threat hunting using machine learning to identify hidden threats, zero-day exploits, and advanced persistent threats in your environment.',
        icon: Bot,
        category: 'AI Security Tools',
        path: '/tools/ai-threat-hunter',
        features: [
            'ML-based threat detection',
            'Behavioral analysis',
            'Zero-day identification',
            'APT detection',
        ],
        status: 'coming-soon',
        color: 'indigo-500',
    },
    {
        id: 'ai-code-scanner',
        name: 'AI Code Security Scanner',
        tagline: 'Intelligent Code Analysis',
        description: 'Leverage AI to scan source code for security vulnerabilities, insecure patterns, and compliance violations. Supports multiple programming languages.',
        icon: Code,
        category: 'AI Security Tools',
        path: '/tools/ai-code-scanner',
        features: [
            'Multi-language support',
            'Vulnerability detection',
            'OWASP Top 10 scanning',
            'Fix recommendations',
        ],
        status: 'coming-soon',
        color: 'teal-500',
    },
    {
        id: 'ai-phishing-detector',
        name: 'AI Phishing Detector',
        tagline: 'Smart Email Analysis',
        description: 'AI-powered phishing email detection and analysis. Identify sophisticated phishing attempts, analyze email headers, and extract IOCs automatically.',
        icon: MessageSquare,
        category: 'AI Security Tools',
        path: '/tools/ai-phishing-detector',
        features: [
            'Email content analysis',
            'Header inspection',
            'IOC extraction',
            'Brand impersonation detection',
        ],
        status: 'coming-soon',
        color: 'orange-500',
    },
    {
        id: 'ai-network-analyzer',
        name: 'AI Network Analyzer',
        tagline: 'Intelligent Traffic Analysis',
        description: 'Use AI to analyze network traffic patterns, detect anomalies, and identify potential security threats in real-time network communications.',
        icon: Network,
        category: 'AI Security Tools',
        path: '/tools/ai-network-analyzer',
        features: [
            'Traffic pattern analysis',
            'Anomaly detection',
            'Protocol analysis',
            'Malicious activity detection',
        ],
        status: 'coming-soon',
        color: 'cyan-500',
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
