import { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Code,
  DatabaseZap,
  Bug,
  EyeOff,
  Search,
  Lock,
  ClipboardCheck,
  Target,
  Activity,
  FileCheck,
  ArrowRight,
  ChevronRight,
  Check,
  Building2,
  Landmark,
  Scale,
  Factory,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

export const metadata: Metadata = {
  title: 'GenAI Security | Cesium Cyber',
  description:
    'Secure your AI deployments against prompt injection, data leakage, model poisoning, and emerging GenAI threats. Expert AI security assessments and continuous protection.',
};

const threats = [
  {
    icon: Code,
    title: 'Prompt Injection',
    description:
      'Attackers craft malicious inputs to manipulate LLM behavior, bypass safety guardrails, and extract unauthorized information from your AI systems.',
  },
  {
    icon: DatabaseZap,
    title: 'Data Leakage',
    description:
      'Sensitive data — PII, trade secrets, internal documents — can be inadvertently exposed through model outputs, training data memorization, or misconfigured AI pipelines.',
  },
  {
    icon: Bug,
    title: 'Model Poisoning',
    description:
      'Adversaries manipulate training data or fine-tuning processes to corrupt model behavior, introducing backdoors or biased outputs that undermine trust.',
  },
  {
    icon: EyeOff,
    title: 'Shadow AI',
    description:
      'Employees adopt unsanctioned AI tools and services without IT oversight, creating data governance blind spots and expanding your unmonitored attack surface.',
  },
];

const capabilities = [
  {
    icon: Search,
    title: 'LLM Security Auditing',
    description: 'Comprehensive security testing for your language model deployments.',
    features: [
      'Prompt injection testing',
      'Output filtering validation',
      'Guardrail effectiveness assessment',
    ],
  },
  {
    icon: Lock,
    title: 'AI Data Protection',
    description: 'Prevent sensitive data from leaking through AI interactions.',
    features: [
      'PII detection in prompts and responses',
      'Data loss prevention for AI pipelines',
      'Training data privacy auditing',
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'Model Governance',
    description: 'Establish controls and visibility over your AI ecosystem.',
    features: [
      'Access controls and role-based permissions',
      'Usage monitoring and audit trails',
      'Model inventory management',
    ],
  },
  {
    icon: Activity,
    title: 'AI Threat Detection',
    description: 'Monitor and respond to threats targeting your AI systems in real time.',
    features: [
      'Real-time adversarial input detection',
      'Anomaly detection in model behavior',
      'Automated incident alerting',
    ],
  },
  {
    icon: FileCheck,
    title: 'Compliance & Frameworks',
    description: 'Align your AI deployments with emerging regulatory requirements.',
    features: [
      'NIST AI RMF alignment',
      'EU AI Act readiness assessment',
      'ISO 42001 gap analysis',
    ],
    complianceTags: ['NIST AI RMF', 'EU AI Act', 'ISO 42001'],
  },
  {
    icon: Target,
    title: 'Red Team for AI',
    description: 'Adversarial testing that simulates real-world AI attacks.',
    features: [
      'Jailbreak and bypass simulation',
      'Bias and hallucination assessment',
      'Adversarial robustness testing',
    ],
    complianceTags: ['OWASP LLM Top 10'],
  },
];

const steps = [
  {
    number: 1,
    title: 'Discover',
    description:
      'Inventory all AI and LLM systems, map data flows, identify integrations, and catalog shadow AI usage across your organization.',
  },
  {
    number: 2,
    title: 'Assess',
    description:
      'Test for prompt injection vulnerabilities, data leakage risks, model weaknesses, and compliance gaps using our proven methodology.',
  },
  {
    number: 3,
    title: 'Harden',
    description:
      'Implement guardrails, input/output filters, monitoring systems, and access controls tailored to your AI architecture.',
  },
  {
    number: 4,
    title: 'Monitor',
    description:
      'Continuous threat detection, compliance validation, and periodic reassessment to keep pace with evolving AI risks.',
  },
];

const industries = [
  {
    icon: Building2,
    name: 'Healthcare',
    concern: 'Protect patient data in AI-assisted diagnostics and clinical workflows.',
    href: '/industries/healthcare',
  },
  {
    icon: Landmark,
    name: 'Financial Services',
    concern: 'Secure AI-driven fraud detection, underwriting, and customer interactions.',
    href: '/industries/financial',
  },
  {
    icon: Scale,
    name: 'Legal',
    concern: 'Safeguard privileged information in AI-powered legal research and review.',
    href: '/industries/legal',
  },
  {
    icon: Factory,
    name: 'Manufacturing',
    concern: 'Protect proprietary processes in AI-optimized production and supply chains.',
    href: '/industries/manufacturing',
  },
  {
    icon: ShoppingCart,
    name: 'Retail',
    concern: 'Secure customer data in AI-driven personalization and recommendation engines.',
    href: '/industries/retail',
  },
];

const differentiators = [
  {
    icon: Shield,
    title: 'Security-First AI Expertise',
    description:
      'Our team combines deep cybersecurity experience with hands-on AI and machine learning knowledge — we understand both the threats and the technology.',
  },
  {
    icon: Zap,
    title: 'Practical, Not Theoretical',
    description:
      'We go beyond checklists and whitepapers. Our engagements include hands-on testing, real attack simulations, and actionable remediation guidance.',
  },
  {
    icon: FileCheck,
    title: 'Framework-Aligned',
    description:
      'Every assessment maps to established standards — NIST AI RMF, OWASP LLM Top 10, EU AI Act — so your results are audit-ready and defensible.',
  },
];

const stats = [
  { value: '$4.5T', label: 'Projected AI market by 2030' },
  { value: '85%', label: 'Of enterprises plan GenAI adoption by 2026' },
  { value: '56%', label: 'Of firms cite AI security as top concern' },
  { value: '3x', label: 'Increase in AI-related attacks since 2023' },
];

export default function GenAISecurityPage() {
  return (
    <main>
      {/* ===== Section 1: Hero ===== */}
      <section className="relative bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="text-violet-400 font-medium text-sm uppercase tracking-wider">
              Products
            </p>

            <h1 className="text-4xl lg:text-6xl font-bold text-white font-display leading-tight">
              Secure Your <span className="text-violet-400">AI</span> Future
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Protect your GenAI deployments against prompt injection, data leakage,
              model poisoning, and the emerging threats that traditional security
              tools miss.
            </p>

            {/* Stat Callout */}
            <div className="rounded-lg border border-white/10 bg-[#121212]/80 p-6 max-w-2xl mx-auto">
              <p className="text-lg text-gray-300 leading-relaxed">
                <span className="text-violet-400 font-bold">85%</span> of enterprises
                plan to adopt GenAI by 2026 — but most lack a strategy to secure it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/tools/prompt-injection-scanner">
                  Try the Prompt Injection Scanner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                asChild
              >
                <Link href="/contact?service=genai-security">
                  Get a GenAI Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 2: Threat Landscape ===== */}
      <section className="bg-[#0A0A0A] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-display mb-4">
              The GenAI Threat Landscape
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              AI introduces a new class of security risks that conventional tools
              weren&apos;t designed to detect or prevent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {threats.map((threat) => {
              const Icon = threat.icon;
              return (
                <GlassCard key={threat.title} glow>
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-violet-500/10 p-3">
                    <Icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-display">
                    {threat.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {threat.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Section 3: Core Capabilities ===== */}
      <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-display mb-4">
              What We Protect
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Six core capabilities covering the full lifecycle of GenAI security —
              from auditing and governance to red teaming and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-lg border border-white/10 bg-[#0A0A0A] p-6 transition-shadow hover:shadow-violet-500/5"
                >
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-violet-500/10 p-3">
                    <Icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-display">
                    {cap.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {cap.description}
                  </p>

                  {/* Compliance Tags */}
                  {cap.complianceTags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cap.complianceTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="space-y-2">
                    {cap.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-gray-400 flex items-start"
                      >
                        <Check className="h-4 w-4 text-violet-400 mr-2 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Section 4: How It Works ===== */}
      <section className="bg-[#0A0A0A] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-display mb-4">
              Our Approach
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A proven four-step methodology to systematically secure your AI
              deployments.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-8 bottom-8 w-px bg-violet-500/20 hidden md:block" />

              <div className="space-y-8">
                {steps.map((step) => (
                  <div key={step.number} className="relative flex gap-6">
                    {/* Number badge */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-lg font-display z-10">
                      {step.number}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <h3 className="text-xl font-semibold text-white mb-2 font-display">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 5: Industries ===== */}
      <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-display mb-4">
              Industries We Serve
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every industry faces unique GenAI security challenges. We bring
              specialized expertise to each.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <Link
                  key={industry.name}
                  href={industry.href}
                  className="group rounded-lg border border-white/10 bg-[#0A0A0A] p-6 transition-all hover:border-violet-500/30 hover:shadow-violet-500/5"
                >
                  <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-violet-500/10 p-3">
                    <Icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-display group-hover:text-violet-400 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {industry.concern}
                  </p>
                  <span className="inline-flex items-center text-violet-400 text-sm mt-3 group-hover:gap-2 transition-all">
                    Learn more
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Section 6: Differentiators ===== */}
      <section className="bg-[#0A0A0A] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-display mb-4">
              Why Cesium
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {differentiators.map((diff) => {
              const Icon = diff.icon;
              return (
                <div
                  key={diff.title}
                  className="rounded-lg border border-white/10 bg-[#0A0A0A] p-6"
                >
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-violet-500/10 p-3">
                    <Icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-display">
                    {diff.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Section 7: Stats Banner ===== */}
      <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl lg:text-4xl font-bold text-violet-400 font-display mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 8: CTA ===== */}
      <section className="bg-[#0A0A0A] py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-white font-display">
              Ready to Secure Your AI?
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Whether you&apos;re deploying your first LLM or managing AI at
              enterprise scale, we&apos;ll help you do it securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/contact?service=genai-security">
                  Book a GenAI Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                asChild
              >
                <Link href="/contact">
                  Talk to Our Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
