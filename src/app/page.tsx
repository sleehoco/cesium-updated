import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Heart,
  Factory,
  Scale,
  Landmark,
  ShoppingCart,
  Shield,
  ClipboardCheck,
  Zap,
  ArrowRight,
  MapPin,
  Award,
  Users,
  CheckCircle,
  Quote,
} from 'lucide-react';

const industries = [
  {
    title: 'Healthcare',
    icon: Heart,
    painPoint: 'HIPAA compliance & patient data protection',
    badge: 'HIPAA',
    slug: 'healthcare',
  },
  {
    title: 'Manufacturing',
    icon: Factory,
    painPoint: 'CMMC readiness & supply chain security',
    badge: 'CMMC',
    slug: 'manufacturing',
  },
  {
    title: 'Legal',
    icon: Scale,
    painPoint: 'Client confidentiality & cyber insurance',
    badge: 'ABA Ethics',
    slug: 'legal',
  },
  {
    title: 'Financial Services',
    icon: Landmark,
    painPoint: 'PCI-DSS compliance & fraud prevention',
    badge: 'PCI-DSS',
    slug: 'financial-services',
  },
  {
    title: 'Retail & Consumer',
    icon: ShoppingCart,
    painPoint: 'POS security & customer data protection',
    badge: 'PCI-DSS',
    slug: 'retail-consumer',
  },
];

const services = [
  {
    title: 'Security Assessment',
    icon: Shield,
    description: 'Identify vulnerabilities and strengthen your defense posture with thorough security evaluations.',
  },
  {
    title: 'Compliance & Risk',
    icon: ClipboardCheck,
    description:
      'Navigate complex regulatory requirements and reduce risk with expert compliance guidance.',
  },
  {
    title: 'Penetration Testing',
    icon: Zap,
    description:
      'Simulate real-world attacks to uncover security gaps before malicious actors exploit them.',
  },
];

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '500+', label: 'Businesses Served' },
  { value: '1000+', label: 'Compliance Audits' },
];

export default function HomePage() {
  return (
    <main>
      {/* ===== 3A: Hero Section ===== */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-white font-display leading-tight">
              Cybersecurity That Speaks{' '}
              <span className="text-sky-400">Your Language</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              HIPAA. CMMC. PCI-DSS. We handle your compliance and security — so
              you can focus on your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/contact">
                  Get Your Free Risk Score
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-navy-700 text-gray-300 hover:bg-navy-800 hover:text-white"
                asChild
              >
                <Link href="#industries">See How We Protect Local Businesses</Link>
              </Button>
            </div>

            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-navy-800 border border-navy-700 px-4 py-2 text-sm text-gray-300">
                <Users className="h-4 w-4 text-sky-400" />
                500+ Businesses Protected
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-navy-800 border border-navy-700 px-4 py-2 text-sm text-gray-300">
                <Award className="h-4 w-4 text-sky-400" />
                HIPAA &amp; CMMC Certified
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-navy-800 border border-navy-700 px-4 py-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-sky-400" />
                Based in Columbia, MD
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3B: Industry Cards Section ===== */}
      <section id="industries" className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-display mb-4">
              We Protect Businesses Like Yours
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group block rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4">
                    <Icon className="h-10 w-10 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                    {industry.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {industry.painPoint}
                  </p>
                  <span className="inline-block rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-medium text-sky-700">
                    {industry.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 3C: Services Overview Section ===== */}
      <section className="bg-navy-900 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white font-display mb-4">
              Comprehensive Security Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-xl border border-navy-700 bg-navy-800 p-8 text-center"
                >
                  <div className="mb-5 inline-flex items-center justify-center rounded-lg bg-navy-900 p-3">
                    <Icon className="h-8 w-8 text-sky-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center text-sky-400 font-medium hover:text-sky-300 transition-colors"
            >
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 3D: Social Proof Section ===== */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-display mb-4">
              Trusted by Maryland Businesses
            </h2>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-sky-600 font-display">
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-8">
            <Quote className="h-8 w-8 text-sky-500 mb-4" />
            <blockquote className="text-lg text-slate-800 leading-relaxed mb-6">
              &ldquo;CesiumCyber helped us achieve HIPAA compliance in record
              time. Their team understood our healthcare operations and made the
              process painless.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <div className="font-medium text-slate-800">
                  Healthcare Practice Manager
                </div>
                <div className="text-sm text-slate-500">Baltimore, MD</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3E: CTA Section ===== */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-white font-display">
              Is Your Business Compliant?
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Most Maryland businesses have critical security gaps they
              don&apos;t know about. Find out where you stand with a free risk
              assessment.
            </p>
            <div className="pt-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/contact">
                  Get Your Free Risk Score
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
