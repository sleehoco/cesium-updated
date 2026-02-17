import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How CesiumCyber collects, uses, and protects your data.',
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
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-collected', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Information' },
  { id: 'sharing', label: 'Information Sharing' },
  { id: 'security', label: 'Data Security' },
  { id: 'retention', label: 'Data Retention' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'third-party', label: 'Third-Party Links' },
  { id: 'childrens-privacy', label: "Children's Privacy" },
  { id: 'international', label: 'International Transfers' },
  { id: 'california', label: 'California Privacy Rights' },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact Us' },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-charcoal-900">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-violet-400 mb-3 uppercase tracking-wider">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-lg">
              How we collect, use, and protect your information when you use the Cesium platform.
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
            <Section id="introduction" title="1. Introduction">
              <p>
                Cesium Cybersecurity and Solutions, LLC (&ldquo;CesiumCyber,&rdquo; &ldquo;we,&rdquo;
                &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                you visit our website and use our services.
              </p>
              <p>
                By accessing or using the Cesium platform, you acknowledge that you have read and understood
                this Privacy Policy.
              </p>
            </Section>

            <Section id="information-collected" title="2. Information We Collect">
              <SubSection title="2.1 Information You Provide">
                <p>We may collect information that you voluntarily provide, including:</p>
                <ul className="list-disc ml-5 space-y-1.5">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Company name and job title</li>
                  <li>Information submitted through contact forms or service requests</li>
                  <li>Communications with our support team</li>
                </ul>
              </SubSection>
              <SubSection title="2.2 Automatically Collected Information">
                <p>When you visit our website, we may automatically collect:</p>
                <ul className="list-disc ml-5 space-y-1.5">
                  <li>IP address and approximate location</li>
                  <li>Browser type, version, and language</li>
                  <li>Device type and operating system</li>
                  <li>Pages visited, time on page, and navigation paths</li>
                  <li>Referring website or source</li>
                </ul>
              </SubSection>
              <SubSection title="2.3 Security Tool Data">
                <p>When you use Cesium&apos;s security tools, we may process:</p>
                <ul className="list-disc ml-5 space-y-1.5">
                  <li>IP addresses, domains, URLs, or file hashes you submit for analysis</li>
                  <li>Email headers submitted for phishing analysis</li>
                  <li>Analysis results from third-party services (e.g., VirusTotal)</li>
                </ul>
                <p className="text-sm text-gray-500 border-l-2 border-violet-500/30 pl-3">
                  Security tool data is processed in real-time and is not permanently stored on our servers
                  unless you explicitly opt in to saving results.
                </p>
              </SubSection>
            </Section>

            <Section id="how-we-use" title="3. How We Use Your Information">
              <p>We use collected information to:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li>Provide, operate, and maintain our services</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Send administrative information and service updates</li>
                <li>Improve our website, tools, and user experience</li>
                <li>Analyze usage patterns and platform performance</li>
                <li>Detect and prevent security threats and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </Section>

            <Section id="sharing" title="4. Information Sharing & Disclosure">
              <p>
                <strong className="text-gray-200">We do not sell your personal information.</strong> We may
                share your information in the following limited circumstances:
              </p>
              <SubSection title="4.1 Service Providers">
                <p>Third-party vendors who perform services on our behalf:</p>
                <ul className="list-disc ml-5 space-y-1.5">
                  <li>Cloud hosting and infrastructure (Vercel, Supabase)</li>
                  <li>Email delivery services (Resend)</li>
                  <li>Analytics (Vercel Analytics)</li>
                  <li>Security analysis APIs (VirusTotal)</li>
                  <li>AI model providers (xAI) for our security assistant</li>
                </ul>
              </SubSection>
              <SubSection title="4.2 Legal Requirements">
                <p>
                  We may disclose information if required by law or in response to valid requests by public
                  authorities (e.g., a court order or government agency).
                </p>
              </SubSection>
              <SubSection title="4.3 Business Transfers">
                <p>
                  In the event of a merger, acquisition, or sale of assets, your information may be
                  transferred to the acquiring entity with the same privacy protections.
                </p>
              </SubSection>
            </Section>

            <Section id="security" title="5. Data Security">
              <p>We implement appropriate technical and organizational measures, including:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li>Encryption of data in transit (TLS 1.3)</li>
                <li>Encryption of data at rest</li>
                <li>Role-based access controls and authentication</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Security awareness training for all team members</li>
              </ul>
              <p>
                No method of transmission over the internet is 100% secure. While we strive to protect your
                information using commercially reasonable measures, we cannot guarantee absolute security.
              </p>
            </Section>

            <Section id="retention" title="6. Data Retention">
              <p>
                We retain personal information only as long as necessary to fulfill the purposes described
                in this policy, unless a longer retention period is required by law. Security tool queries
                are processed in real-time and not permanently stored.
              </p>
              <p>
                You may request deletion of your data at any time by contacting us.
              </p>
            </Section>

            <Section id="your-rights" title="7. Your Privacy Rights">
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li><strong className="text-gray-200">Access</strong> &mdash; request a copy of your personal data</li>
                <li><strong className="text-gray-200">Correction</strong> &mdash; request correction of inaccurate data</li>
                <li><strong className="text-gray-200">Deletion</strong> &mdash; request deletion of your data</li>
                <li><strong className="text-gray-200">Portability</strong> &mdash; receive your data in a machine-readable format</li>
                <li><strong className="text-gray-200">Restriction</strong> &mdash; request that we limit processing</li>
                <li><strong className="text-gray-200">Opt-out</strong> &mdash; unsubscribe from marketing communications</li>
              </ul>
              <p>
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@cesiumcyber.com" className="text-violet-400 hover:underline">
                  privacy@cesiumcyber.com
                </a>.
                We will respond within 30 days.
              </p>
            </Section>

            <Section id="cookies" title="8. Cookies & Tracking Technologies">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc ml-5 space-y-1.5">
                <li>Maintain session state and preferences</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve site performance and user experience</li>
              </ul>
              <p>
                You can manage cookie preferences through your browser settings. Disabling cookies may
                affect certain site functionality.
              </p>
            </Section>

            <Section id="third-party" title="9. Third-Party Links">
              <p>
                Our website may contain links to third-party sites. We are not responsible for their privacy
                practices and encourage you to review their policies before providing personal information.
              </p>
            </Section>

            <Section id="childrens-privacy" title="10. Children's Privacy">
              <p>
                Our services are not directed to individuals under 18. We do not knowingly collect personal
                information from children. If you believe we have inadvertently collected such information,
                please contact us and we will promptly delete it.
              </p>
            </Section>

            <Section id="international" title="11. International Data Transfers">
              <p>
                Your information may be transferred to and processed in countries other than your country
                of residence. These countries may have different data protection laws. We take appropriate
                safeguards to ensure your data remains protected in accordance with this policy.
              </p>
            </Section>

            <Section id="california" title="12. California Privacy Rights (CCPA)">
              <p>
                If you are a California resident, you have additional rights under the California Consumer
                Privacy Act (CCPA), including the right to know what personal information we collect, the
                right to request deletion, and the right to opt out of the sale of personal information.
              </p>
              <p>
                <strong className="text-gray-200">We do not sell personal information.</strong> To exercise
                your CCPA rights, contact{' '}
                <a href="mailto:privacy@cesiumcyber.com" className="text-violet-400 hover:underline">
                  privacy@cesiumcyber.com
                </a>.
              </p>
            </Section>

            <Section id="changes" title="13. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page
                with an updated effective date. We encourage you to review this policy periodically. Material
                changes will be communicated via email or a prominent notice on our site.
              </p>
            </Section>

            <Section id="contact" title="14. Contact Us">
              <p>For questions or concerns about this Privacy Policy:</p>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 space-y-3 not-prose">
                <p className="text-gray-300">
                  <span className="text-gray-500 text-sm">Privacy inquiries</span><br />
                  <a href="mailto:privacy@cesiumcyber.com" className="text-violet-400 hover:underline">privacy@cesiumcyber.com</a>
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

            {/* Back to top */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  See also: <Link href="/terms" className="text-violet-400 hover:underline">Terms of Service</Link>
                </p>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Back to top &uarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
