import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - CesiumCyber',
  description: 'Privacy Policy for CesiumCyber - How we collect, use, and protect your data',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cyber-dark">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-cesium">
            Privacy Policy
          </h1>

          <div className="text-gray-300 space-y-8">
            <p className="text-sm text-gray-400">
              Last Updated: December 1, 2025
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="mb-4">
                CesiumCyber (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-cesium mb-3">2.1 Information You Provide</h3>
              <p className="mb-4">We may collect information that you voluntarily provide to us, including:</p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Company name and job title</li>
                <li>Information submitted through contact forms or service requests</li>
                <li>Communications with our support team</li>
              </ul>

              <h3 className="text-xl font-semibold text-cesium mb-3">2.2 Automatically Collected Information</h3>
              <p className="mb-4">When you visit our website, we may automatically collect:</p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>

              <h3 className="text-xl font-semibold text-cesium mb-3">2.3 Threat Intelligence Tool Data</h3>
              <p className="mb-4">
                When you use our Threat Intelligence Analyzer tool, we may process:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>IP addresses, domains, or file hashes you submit for analysis</li>
                <li>Analysis results from third-party security services (VirusTotal)</li>
                <li>This data is processed in real-time and not permanently stored on our servers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for:</p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>Providing and maintaining our services</li>
                <li>Responding to your inquiries and support requests</li>
                <li>Sending administrative information and service updates</li>
                <li>Improving our website and services</li>
                <li>Analyzing usage patterns and trends</li>
                <li>Detecting and preventing security threats</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information with:</p>

              <h3 className="text-xl font-semibold text-cesium mb-3">4.1 Service Providers</h3>
              <p className="mb-4">
                Third-party vendors who perform services on our behalf, including:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>Email delivery services (Resend)</li>
                <li>Cloud hosting providers (Vercel, Supabase)</li>
                <li>Analytics providers (Google Analytics)</li>
                <li>Security analysis services (VirusTotal)</li>
              </ul>

              <h3 className="text-xl font-semibold text-cesium mb-3">4.2 Legal Requirements</h3>
              <p className="mb-4">
                We may disclose your information if required to do so by law or in response to valid
                requests by public authorities (e.g., a court or government agency).
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">4.3 Business Transfers</h3>
              <p className="mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be
                transferred to the acquiring entity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational security measures to protect your
                information, including:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security assessments and monitoring</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="mb-4">
                However, no method of transmission over the internet is 100% secure. While we strive
                to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
              <p className="mb-4">
                We retain your personal information only for as long as necessary to fulfill the
                purposes outlined in this Privacy Policy, unless a longer retention period is required
                or permitted by law. Threat intelligence queries are processed in real-time and not
                permanently stored.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights</h2>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
              </ul>
              <p className="mb-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@cesiumcyber.com" className="text-cesium hover:underline">
                  privacy@cesiumcyber.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="mb-4">We use cookies and similar tracking technologies to:</p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>Maintain session state</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve user experience</li>
              </ul>
              <p className="mb-4">
                You can control cookies through your browser settings. Note that disabling cookies may
                affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Links</h2>
              <p className="mb-4">
                Our website may contain links to third-party websites. We are not responsible for the
                privacy practices of these external sites. We encourage you to review their privacy
                policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Our services are not directed to individuals under the age of 18. We do not knowingly
                collect personal information from children. If you believe we have collected information
                from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your country
                of residence. These countries may have different data protection laws. By using our services,
                you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. California Privacy Rights</h2>
              <p className="mb-4">
                If you are a California resident, you have additional rights under the California Consumer
                Privacy Act (CCPA), including the right to know what personal information we collect and
                the right to request deletion of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
                We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Contact Us</h2>
              <p className="mb-4">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="bg-cyber-light p-6 border-l-4 border-cesium">
                <p className="mb-2">
                  <strong className="text-white">Email:</strong>{' '}
                  <a href="mailto:privacy@cesiumcyber.com" className="text-cesium hover:underline">
                    privacy@cesiumcyber.com
                  </a>
                </p>
                <p className="mb-2">
                  <strong className="text-white">Email:</strong>{' '}
                  <a href="mailto:information@cesiumcyber.com" className="text-cesium hover:underline">
                    information@cesiumcyber.com
                  </a>
                </p>
                <p>
                  <strong className="text-white">Address:</strong> CesiumCyber, LLC
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
