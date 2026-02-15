import Link from 'next/link';
import { AlertTriangle, Shield, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IndustryConfig } from '@/config/industries-config';

export function IndustryPage({ config }: { config: IndustryConfig }) {
  return (
    <main>
      {/* ===== Hero Section — Dark ===== */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="text-sky-400 font-medium text-sm uppercase tracking-wider">
              {config.name} Cybersecurity
            </p>

            <h1 className="text-4xl lg:text-5xl font-bold text-white font-display leading-tight">
              {config.headline}
            </h1>

            {/* Hero Stat Callout */}
            <div className="rounded-lg border border-navy-700 bg-navy-800/80 p-6 max-w-2xl mx-auto">
              <p className="text-lg text-gray-300 leading-relaxed">
                {config.heroStat}
              </p>
            </div>

            {/* Compliance Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {config.complianceBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full bg-navy-800 border border-navy-700 px-4 py-2 text-sm font-medium text-gray-300"
                >
                  <Shield className="h-4 w-4 text-sky-400" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="pt-4">
              <Button size="lg" variant="accent" asChild>
                <Link href={config.ctaHref}>
                  {config.ctaButtonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Threats Section — Light ===== */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-display mb-4">
              Key Threats Facing {config.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {config.threats.map((threat) => (
              <div
                key={threat.title}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-sky-50 p-3">
                  <AlertTriangle className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {threat.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {threat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Services Mapping Section — Dark ===== */}
      <section className="bg-navy-900 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-display mb-4">
              How We Help {config.name} Organizations
            </h2>
          </div>

          <div className="max-w-5xl mx-auto space-y-4">
            {/* Column Headers */}
            <div className="hidden md:grid md:grid-cols-2 gap-6 px-6 pb-2">
              <p className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
                What the Framework Requires
              </p>
              <p className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
                How We Deliver It
              </p>
            </div>

            {config.servicesMapping.map((mapping, index) => (
              <div
                key={mapping.requirement}
                className={`rounded-lg border border-navy-700 p-6 ${
                  index % 2 === 0 ? 'bg-navy-800' : 'bg-navy-800/60'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-sky-400 uppercase tracking-wider md:hidden mb-2">
                      What the Framework Requires
                    </p>
                    <p className="text-white font-medium">
                      {mapping.requirement}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {mapping.delivery}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Case Study Placeholder — Light ===== */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-display mb-4">
              Case Study
            </h2>
          </div>

          <div className="max-w-2xl mx-auto rounded-lg border border-slate-200 bg-white p-12 text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-lg bg-sky-50 p-4">
              <FileText className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2 font-display">
              Case Study Coming Soon
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We are preparing a detailed case study showcasing how we helped a{' '}
              {config.name.toLowerCase()} organization strengthen their security
              posture and achieve compliance.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA Section — Dark ===== */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-display">
              {config.ctaHeadline}
            </h2>
            <div className="pt-4">
              <Button size="lg" variant="accent" asChild>
                <Link href={config.ctaHref}>
                  {config.ctaButtonText}
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
