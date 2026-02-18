import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using the CesiumCyber platform and services.',
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="text-gray-400 leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-200 mb-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

const tocItems = [
  { id: 'acceptance', label: 'Acceptance of Terms' },
  { id: 'services', label: 'Description of Services' },
  { id: 'user-obligations', label: 'User Obligations' },
  { id: 'intellectual-property', label: 'Intellectual Property' },
  { id: 'privacy', label: 'Privacy & Data Protection' },
  { id: 'third-party', label: 'Third-Party Services' },
  { id: 'disclaimers', label: 'Disclaimers & Limitations' },
  { id: 'indemnification', label: 'Indemnification' },
  { id: 'professional-services', label: 'Professional Services' },
  { id: 'confidentiality', label: 'Confidentiality' },
  { id: 'termination', label: 'Termination' },
  { id: 'dispute-resolution', label: 'Dispute Resolution' },
  { id: 'general', label: 'General Provisions' },
  { id: 'contact', label: 'Contact Us' },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-charcoal-900">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-violet-400 mb-3 uppercase tracking-wider">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Terms of Service
            </h1>
            <p className="text-gray-400 text-lg">
              The terms and conditions that govern your use of the Cesium platform and services.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Effective date: February 1, 2026 &middot; Last updated: February 1, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Sidebar TOC */}
          <aside className="lg:w-56 shrink-0">
            <nav className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">On this page</p>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-gray-500 hover:text-violet-400 transition-colors block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 max-w-3xl space-y-12">
            <Section id="acceptance" title="1. Acceptance of Terms">
              <p>
                By accessing and using the CesiumCyber website and services (&ldquo;Services&rdquo;), you
                accept and agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not
                agree to these Terms, please do not use our Services.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be posted on this page
                with an updated effective date. Your continued use of the Services after changes are posted
                constitutes acceptance of the modified Terms.
              </p>
            </Section>

            <Section id="services" title="2. Description of Services">
              <p>CesiumCyber provides cybersecurity services and tools, including:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li>Threat intelligence analysis and scanning tools</li>
                <li>Password strength testing and breach checking</li>
                <li>Email security analysis (SPF, DKIM, DMARC)</li>
                <li>HTTP security header scanning</li>
                <li>Compliance readiness assessments</li>
                <li>Email header analysis for phishing detection</li>
                <li>AI-powered security assistant</li>
                <li>Professional security consulting and advisory services</li>
                <li>Penetration testing and vulnerability assessments</li>
                <li>Managed security services</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of our Services at any
                time without prior notice.
              </p>
            </Section>

            <Section id="user-obligations" title="3. User Obligations">
              <SubSection title="3.1 Acceptable Use">
                <p>
                  You agree to use our Services only for lawful purposes and in accordance with these Terms.
                  You agree <strong className="text-gray-200">not</strong> to:
                </p>
                <ul className="list-disc ml-5 space-y-1.5">
                  <li>Use the Services for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to systems or networks</li>
                  <li>Use the Services to transmit malware, viruses, or harmful code</li>
                  <li>Interfere with or disrupt the Services or servers</li>
                  <li>Scrape, crawl, or mine data from the platform</li>
                  <li>Infringe on intellectual property rights of others</li>
                  <li>Impersonate any person or entity</li>
                  <li>Use security tools to attack or probe systems you do not own or have authorization to test</li>
                </ul>
              </SubSection>
              <SubSection title="3.2 Account Security">
                <p>
                  If you create an account, you are responsible for maintaining the confidentiality of your
                  credentials and for all activity under your account. Notify us immediately of any
                  unauthorized use.
                </p>
              </SubSection>
              <SubSection title="3.3 Accurate Information">
                <p>
                  You agree to provide accurate, current, and complete information and to update it as necessary.
                </p>
              </SubSection>
            </Section>

            <Section id="intellectual-property" title="4. Intellectual Property">
              <SubSection title="4.1 Our Content">
                <p>
                  All content on our website&mdash;including text, graphics, logos, icons, images, and
                  software&mdash;is the property of CesiumCyber or its licensors and is protected by copyright,
                  trademark, and other intellectual property laws.
                </p>
              </SubSection>
              <SubSection title="4.2 Limited License">
                <p>
                  We grant you a limited, non-exclusive, non-transferable, revocable license to access and use
                  our Services for personal or internal business purposes. This license does not include the right to:
                </p>
                <ul className="list-disc ml-5 space-y-1.5">
                  <li>Modify, copy, distribute, or create derivative works</li>
                  <li>Reverse engineer or decompile any software</li>
                  <li>Remove copyright or proprietary notices</li>
                  <li>Transfer or sublicense your rights</li>
                </ul>
              </SubSection>
              <SubSection title="4.3 User Content">
                <p>
                  You retain ownership of content you submit. By submitting content, you grant us a worldwide,
                  non-exclusive, royalty-free license to use, reproduce, and process such content solely for
                  providing our Services.
                </p>
              </SubSection>
            </Section>

            <Section id="privacy" title="5. Privacy & Data Protection">
              <p>
                Your use of our Services is also governed by our{' '}
                <Link href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>,
                which is incorporated into these Terms by reference. Please review our Privacy Policy to
                understand how we collect, use, and protect your data.
              </p>
            </Section>

            <Section id="third-party" title="6. Third-Party Services">
              <p>
                Our Services may integrate with or link to third-party services, including but not limited to
                VirusTotal, xAI, and various security analysis providers. We are not responsible for the
                content, accuracy, or practices of these third-party services. Your use of them is subject to
                their respective terms and policies.
              </p>
            </Section>

            <Section id="disclaimers" title="7. Disclaimers & Limitations">
              <SubSection title="7.1 No Warranty">
                <p className="uppercase text-sm tracking-wide">
                  The Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
                  warranties of any kind, either express or implied, including but not limited to implied
                  warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
              </SubSection>
              <SubSection title="7.2 No Guarantee of Security">
                <p>
                  While we strive to provide accurate security analysis and recommendations, we do not
                  guarantee that our Services will detect all threats or vulnerabilities. Cybersecurity is an
                  evolving field and no solution provides 100% protection. Our tools and analyses are
                  informational and should not be your sole source of security assurance.
                </p>
              </SubSection>
              <SubSection title="7.3 Limitation of Liability">
                <p className="uppercase text-sm tracking-wide">
                  To the maximum extent permitted by law, CesiumCyber shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages, or any loss of profits, revenues,
                  data, use, goodwill, or other intangible losses resulting from your use of or inability to
                  use the Services.
                </p>
                <p>
                  Our total liability shall not exceed the amount paid by you in the twelve (12) months
                  preceding the claim, or one hundred dollars ($100), whichever is greater.
                </p>
              </SubSection>
            </Section>

            <Section id="indemnification" title="8. Indemnification">
              <p>
                You agree to indemnify, defend, and hold harmless CesiumCyber, its officers, directors,
                employees, agents, and affiliates from any claims, liabilities, damages, losses, and expenses
                (including reasonable attorneys&apos; fees) arising from your use of the Services, violation of
                these Terms, or violation of any third-party rights.
              </p>
            </Section>

            <Section id="professional-services" title="9. Professional Services">
              <SubSection title="9.1 Consulting Engagements">
                <p>
                  Professional consulting services are subject to separate written agreements specifying scope,
                  deliverables, timeline, and pricing. These Terms apply unless explicitly superseded by a
                  written agreement.
                </p>
              </SubSection>
              <SubSection title="9.2 Penetration Testing">
                <p>
                  Penetration testing services require prior written authorization and a defined scope.
                  Unauthorized testing of systems or networks is strictly prohibited and may be illegal.
                </p>
              </SubSection>
            </Section>

            <Section id="confidentiality" title="10. Confidentiality">
              <p>
                We understand that you may share sensitive information during the course of our Services. We
                agree to maintain the confidentiality of such information and use it only for providing our
                Services, except as required by law or with your consent.
              </p>
            </Section>

            <Section id="termination" title="11. Termination">
              <p>
                We reserve the right to terminate or suspend your access at any time, with or without cause
                or notice, including for violation of these Terms. Upon termination, your right to use the
                Services will immediately cease.
              </p>
              <p>
                Provisions that by their nature should survive termination shall survive, including
                ownership, warranty disclaimers, indemnification, and limitations of liability.
              </p>
            </Section>

            <Section id="dispute-resolution" title="12. Dispute Resolution">
              <SubSection title="12.1 Governing Law">
                <p>
                  These Terms are governed by the laws of the State of Maryland, without regard to conflict
                  of law provisions.
                </p>
              </SubSection>
              <SubSection title="12.2 Arbitration">
                <p>
                  Any dispute arising from these Terms or the Services shall be resolved through binding
                  arbitration in accordance with the rules of the American Arbitration Association, conducted
                  in the State of Maryland.
                </p>
              </SubSection>
              <SubSection title="12.3 Class Action Waiver">
                <p>
                  You agree that dispute resolution proceedings will be conducted only on an individual basis
                  and not in a class, consolidated, or representative action.
                </p>
              </SubSection>
            </Section>

            <Section id="general" title="13. General Provisions">
              <SubSection title="13.1 Entire Agreement">
                <p>
                  These Terms, together with our Privacy Policy and any separate written agreements, constitute
                  the entire agreement between you and CesiumCyber regarding the Services.
                </p>
              </SubSection>
              <SubSection title="13.2 Severability">
                <p>
                  If any provision is found unenforceable or invalid, it shall be limited to the minimum extent
                  necessary. The remaining provisions remain in full force and effect.
                </p>
              </SubSection>
              <SubSection title="13.3 Waiver">
                <p>
                  Our failure to enforce any right or provision shall not constitute a waiver of that right or
                  provision.
                </p>
              </SubSection>
              <SubSection title="13.4 Assignment">
                <p>
                  You may not assign or transfer these Terms without our prior written consent. We may assign
                  these Terms without restriction.
                </p>
              </SubSection>
            </Section>

            <Section id="contact" title="14. Contact Us">
              <p>For questions about these Terms of Service:</p>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 space-y-3 not-prose">
                <p className="text-gray-300">
                  <span className="text-gray-500 text-sm">Legal inquiries</span><br />
                  <a href="mailto:legal@cesiumcyber.com" className="text-violet-400 hover:underline">legal@cesiumcyber.com</a>
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500 text-sm">General inquiries</span><br />
                  <a href="mailto:information@cesiumcyber.com" className="text-violet-400 hover:underline">information@cesiumcyber.com</a>
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500 text-sm">Entity</span><br />
                  Cesium Cybersecurity and Solutions, LLC
                </p>
              </div>
            </Section>

            {/* Footer note */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  See also: <Link href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>
                </p>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Back to top &uarr;
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                By using our Services, you acknowledge that you have read, understood, and agree to be bound
                by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
