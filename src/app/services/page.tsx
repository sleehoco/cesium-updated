import { Metadata } from 'next';
import { Brain, Network, Eye, Zap, Shield, ChevronRight, Check } from 'lucide-react';
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
    iconColor: 'text-sky-400',
    title: 'Security Assessment',
    tagline: 'Understand where your business is vulnerable',
    description: 'We take a close look at your systems, applications, and processes to find security gaps before they become problems. You get a clear report with prioritized steps to fix what matters most.',
    features: [
      'Network and infrastructure vulnerability scanning',
      'Application security review',
      'Security architecture evaluation and recommendations',
      'Risk assessment and threat modeling',
      'Gap analysis against security frameworks (NIST, ISO 27001)',
      'Prioritized remediation roadmap',
    ],
    complianceTags: ['NIST', 'ISO 27001', 'CMMC'],
  },
  {
    id: 'cloud-security-m365',
    icon: Network,
    iconColor: 'text-teal-400',
    title: 'Cloud Security (M365)',
    tagline: 'Keep your Microsoft 365 environment locked down',
    description: 'If your team runs on Microsoft 365, we make sure it is configured securely. From email protection to data loss prevention, we optimize your cloud setup so sensitive information stays safe.',
    features: [
      'Microsoft 365 security posture assessment',
      'Azure AD and identity protection configuration',
      'Data loss prevention (DLP) policy setup',
      'Multi-factor authentication and conditional access',
      'Microsoft Defender and threat protection tuning',
      'Compliance monitoring (GDPR, HIPAA, SOC 2)',
    ],
    complianceTags: ['HIPAA', 'SOC 2', 'GDPR'],
  },
  {
    id: 'penetration-testing',
    icon: Zap,
    iconColor: 'text-sky-500',
    title: 'Penetration Testing',
    tagline: 'Find out what a hacker would find',
    description: 'Our certified ethical hackers test your systems the same way a real attacker would. We find the weak spots in your network, applications, and even your team\'s awareness so you can fix them before someone exploits them.',
    features: [
      'External and internal network penetration testing',
      'Web application security testing (OWASP Top 10)',
      'Mobile application security assessment',
      'Social engineering and phishing simulations',
      'Wireless network security testing',
      'Executive and technical reports with clear next steps',
    ],
    complianceTags: ['PCI-DSS', 'HIPAA', 'CMMC'],
  },
  {
    id: 'security-audit',
    icon: Eye,
    iconColor: 'text-teal-500',
    title: 'Security Audit',
    tagline: 'Make sure you meet the requirements that matter',
    description: 'Whether you need to pass a compliance audit or just want to know where you stand, we review your policies, controls, and procedures to identify what is working and what needs attention.',
    features: [
      'Compliance audits (PCI DSS, HIPAA, SOC 2, ISO 27001)',
      'Security policy and procedure review',
      'Access control and privilege management audit',
      'Logging and monitoring effectiveness assessment',
      'Incident response plan evaluation',
      'Third-party vendor security assessment',
    ],
    complianceTags: ['PCI-DSS', 'HIPAA', 'SOC 2', 'ISO 27001'],
  },
  {
    id: 'ai-business-integration',
    icon: Brain,
    iconColor: 'text-sky-400',
    title: 'AI Business Integration',
    tagline: 'Put AI to work for your business',
    description: 'We help you use artificial intelligence to save time, reduce costs, and make better decisions. From automating repetitive tasks to building custom AI tools, we tailor solutions to fit your specific business needs.',
    features: [
      'Custom AI solutions tailored to your business',
      'Workflow automation and process optimization',
      'Customer service chatbots and AI assistants',
      'Predictive analytics and business intelligence',
      'AI strategy consulting and implementation planning',
      'Integration with your existing systems and data',
    ],
    complianceTags: ['SOC 2', 'GDPR'],
  },
  {
    id: 'ai-security',
    icon: Shield,
    iconColor: 'text-teal-400',
    title: 'AI Security & Protection',
    tagline: 'Stay safe from AI-powered threats',
    description: 'AI is transforming cybersecurity on both sides. We help protect your organization from new AI-driven attacks while making sure any AI systems you use are secure, compliant, and trustworthy.',
    features: [
      'AI and machine learning security auditing',
      'Prompt injection and jailbreak attack prevention',
      'Data poisoning and adversarial attack detection',
      'AI-powered threat detection and response',
      'Secure AI deployment and governance frameworks',
      'Compliance and ethical AI implementation guidance',
    ],
    complianceTags: ['NIST AI RMF', 'SOC 2', 'GDPR'],
  },
];


export default function ServicesPage() {
  return (
    <main>
      {/* Header - Dark Section */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 font-display">
              Our <span className="text-sky-400">Services</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Comprehensive security assessments, cloud protection, and AI-powered solutions
              tailored to your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid - Light Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="group rounded-lg border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-5">
                    <Icon className={`h-12 w-12 ${service.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">{service.title}</h3>
                  <p className="text-sky-600 font-semibold text-sm mb-4">
                    {service.tagline}
                  </p>
                  <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>

                  {/* Compliance Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.complianceTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-medium text-sky-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-slate-900 font-bold mb-3 flex items-center text-sm">
                      <Check className="h-4 w-4 text-sky-500 mr-2" />
                      What&apos;s Included:
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="text-sm text-slate-600 flex items-start">
                          <ChevronRight className="h-4 w-4 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="accent"
                    className="w-full"
                    asChild
                  >
                    <Link href="/contact">
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Dark Section */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-white font-display">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Every business has different security needs. Let us help you find the right solution
              with a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="accent"
                asChild
              >
                <Link href="/contact">Book a Free Consultation</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-navy-700 text-gray-300 hover:bg-navy-800 hover:text-white"
                asChild
              >
                <Link href="/about">Meet Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
