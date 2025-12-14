import { Metadata } from 'next';
import { Brain, Network, Eye, Zap, Shield, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Comprehensive cybersecurity and AI services. Security assessments, cloud security, penetration testing, audits, and AI business integration.',
};

const services = [
  {
    id: 'security-assessment',
    icon: Shield,
    title: 'Security Assessment',
    tagline: 'Comprehensive security evaluations for your organization',
    description: 'Identify vulnerabilities and strengthen your defense posture with thorough security assessments. We evaluate your infrastructure, applications, and processes to uncover weaknesses before attackers do.',
    features: [
      'Network and infrastructure vulnerability scanning',
      'Application security assessment and code review',
      'Security architecture evaluation and recommendations',
      'Risk assessment and threat modeling',
      'Gap analysis against security frameworks (NIST, ISO 27001)',
      'Detailed remediation roadmap with prioritized actions',
    ],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'cloud-security-m365',
    icon: Network,
    title: 'Cloud Security (M365)',
    tagline: 'Microsoft 365 security optimization and compliance',
    description: 'Secure your Microsoft 365 environment with expert configuration reviews, threat protection optimization, and compliance monitoring. Ensure your cloud infrastructure meets security best practices.',
    features: [
      'Microsoft 365 security posture assessment',
      'Azure AD and identity protection configuration',
      'Data loss prevention (DLP) policy implementation',
      'Conditional access and MFA optimization',
      'Microsoft Defender and threat protection tuning',
      'Compliance monitoring (GDPR, HIPAA, SOC 2)',
    ],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'penetration-testing',
    icon: Zap,
    title: 'Penetration Testing',
    tagline: 'Ethical hacking to discover exploitable weaknesses',
    description: 'Simulate real-world attacks to identify security gaps in your systems, applications, and network. Our certified ethical hackers use the same techniques as malicious actors to find vulnerabilities before they do.',
    features: [
      'External and internal network penetration testing',
      'Web application security testing (OWASP Top 10)',
      'Mobile application security assessment',
      'Social engineering and phishing simulations',
      'Wireless network security testing',
      'Detailed executive and technical reports with remediation guidance',
    ],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'security-audit',
    icon: Eye,
    title: 'Security Audit',
    tagline: 'In-depth compliance audits and security policy reviews',
    description: 'Comprehensive audits to ensure your organization meets regulatory requirements and industry standards. We review policies, procedures, and controls to identify compliance gaps and security weaknesses.',
    features: [
      'Compliance audits (PCI DSS, HIPAA, SOC 2, ISO 27001)',
      'Security policy and procedure review',
      'Access control and privilege management audit',
      'Logging and monitoring effectiveness assessment',
      'Incident response plan evaluation',
      'Third-party vendor security assessment',
    ],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'ai-business-integration',
    icon: Brain,
    title: 'AI Business Integration',
    tagline: 'Transform your operations with intelligent automation',
    description: 'We help businesses leverage AI to automate workflows, enhance decision-making, and unlock new capabilities. From customer service chatbots to predictive analytics, we build custom AI solutions tailored to your needs.',
    features: [
      'Custom AI model development and fine-tuning',
      'Intelligent process automation and workflow optimization',
      'Natural language processing for customer interactions',
      'Predictive analytics and business intelligence',
      'AI strategy consulting and implementation roadmaps',
      'Integration with existing systems and data sources',
    ],
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'ai-security',
    icon: Shield,
    title: 'AI Security & Protection',
    tagline: 'Secure your AI systems and defend against AI-powered threats',
    description: 'Protect your organization from emerging AI-related threats while ensuring your AI systems are secure, compliant, and resilient. We provide comprehensive security for both AI-powered attacks and AI system vulnerabilities.',
    features: [
      'AI/ML model security auditing and vulnerability assessment',
      'Prompt injection and jailbreak attack prevention',
      'Data poisoning and adversarial attack detection',
      'AI-powered threat detection and response systems',
      'Secure AI deployment and governance frameworks',
      'Compliance and ethical AI implementation guidance',
    ],
    gradient: 'from-teal-500 to-green-500',
  },
];


export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cyber-dark via-cyber to-black">
      {/* Header */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-cesium/20 text-cesium text-sm font-mono border border-cesium/40 rounded-sm backdrop-blur">
              CYBERSECURITY & AI SOLUTIONS
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 font-[var(--font-orbitron)]">
            OUR <span className="text-cesium">SERVICES</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Comprehensive security assessments, cloud protection, and AI-powered solutions.
            <br />
            <span className="text-cesium font-semibold">From pentesting to intelligent automation.</span>
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.id}
                className="group relative bg-cyber-light/40 border-2 border-cesium/20 backdrop-blur hover:border-cesium transition-all duration-500 overflow-hidden rounded-none"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${service.gradient}`}></div>

                <CardHeader className="relative z-10">
                  <div className="mb-4">
                    <Icon className="h-14 w-14 text-cesium group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-white text-2xl font-black mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-cesium font-semibold text-base">
                    {service.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-6">
                  <p className="text-gray-300 leading-relaxed">{service.description}</p>

                  <div>
                    <h4 className="text-white font-bold mb-3 flex items-center">
                      <Check className="h-4 w-4 text-cesium mr-2" />
                      Key Features:
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="text-sm text-gray-400 flex items-start">
                          <ChevronRight className="h-4 w-4 text-cesium mr-2 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-2 border-cesium/50 text-cesium hover:bg-cesium hover:text-black font-bold rounded-none group-hover:border-cesium transition-all"
                    asChild
                  >
                    <Link href="/contact">
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-cesium/10 via-transparent to-cesium/10 border-2 border-cesium/30 backdrop-blur rounded-none">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-3xl font-black mb-4">
              READY TO TRANSFORM WITH AI?
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Schedule a consultation to discuss your AI integration and security needs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
            <Button
              size="lg"
              className="bg-cesium hover:bg-cesium-dark text-black font-black px-8 rounded-none border-2 border-cesium shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              asChild
            >
              <Link href="/contact">Book Consultation</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-cesium/50 text-cesium hover:bg-cesium/10 font-bold px-8 rounded-none backdrop-blur"
              asChild
            >
              <Link href="/about">Meet Our Team</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
