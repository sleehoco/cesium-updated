import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - CesiumCyber',
  description: 'Terms of Service for CesiumCyber - Legal terms and conditions for using our services',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cyber-dark">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-cesium">
            Terms of Service
          </h1>

          <div className="text-gray-300 space-y-8">
            <p className="text-sm text-gray-400">
              Last Updated: December 1, 2025
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using the CesiumCyber website and services (&quot;Services&quot;), you accept
                and agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to
                these Terms, please do not use our Services.
              </p>
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. Your continued use of the Services
                after changes are posted constitutes your acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
              <p className="mb-4">
                CesiumCyber provides cybersecurity services, including but not limited to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>AI-powered security analysis and recommendations</li>
                <li>Threat intelligence analysis tools</li>
                <li>Security consulting and advisory services</li>
                <li>Penetration testing and vulnerability assessments</li>
                <li>Security awareness training</li>
                <li>Incident response services</li>
              </ul>
              <p className="mb-4">
                We reserve the right to modify, suspend, or discontinue any aspect of our Services at
                any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Obligations</h2>

              <h3 className="text-xl font-semibold text-cesium mb-3">3.1 Acceptable Use</h3>
              <p className="mb-4">You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>Use the Services for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to any systems or networks</li>
                <li>Use the Services to transmit malware, viruses, or harmful code</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or harvest information about other users</li>
              </ul>

              <h3 className="text-xl font-semibold text-cesium mb-3">3.2 Account Security</h3>
              <p className="mb-4">
                If you create an account with us, you are responsible for maintaining the confidentiality
                of your account credentials and for all activities under your account. You agree to notify
                us immediately of any unauthorized use of your account.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">3.3 Accurate Information</h3>
              <p className="mb-4">
                You agree to provide accurate, current, and complete information when using our Services
                and to update such information as necessary.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property Rights</h2>

              <h3 className="text-xl font-semibold text-cesium mb-3">4.1 Our Content</h3>
              <p className="mb-4">
                All content on our website, including text, graphics, logos, icons, images, audio clips,
                digital downloads, and software, is the property of CesiumCyber or its licensors and is
                protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">4.2 Limited License</h3>
              <p className="mb-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use our
                Services for your personal or internal business purposes. This license does not include
                the right to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>Modify, copy, distribute, or create derivative works</li>
                <li>Reverse engineer or decompile any software</li>
                <li>Remove any copyright or proprietary notices</li>
                <li>Transfer or sublicense your rights to others</li>
              </ul>

              <h3 className="text-xl font-semibold text-cesium mb-3">4.3 User Content</h3>
              <p className="mb-4">
                You retain ownership of any content you submit to our Services. By submitting content,
                you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify,
                and distribute such content solely for the purpose of providing our Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Privacy and Data Protection</h2>
              <p className="mb-4">
                Your use of our Services is also governed by our Privacy Policy, which is incorporated
                into these Terms by reference. Please review our{' '}
                <a href="/privacy" className="text-cesium hover:underline">Privacy Policy</a> to
                understand our data practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services and Links</h2>
              <p className="mb-4">
                Our Services may integrate with or link to third-party services (e.g., VirusTotal, AI providers).
                We are not responsible for the content, accuracy, or practices of these third-party services.
                Your use of third-party services is subject to their respective terms and policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimers and Limitations</h2>

              <h3 className="text-xl font-semibold text-cesium mb-3">7.1 No Warranty</h3>
              <p className="mb-4">
                THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
                OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">7.2 No Guarantee of Security</h3>
              <p className="mb-4">
                While we strive to provide accurate security analysis and recommendations, we do not
                guarantee that our Services will detect all threats or vulnerabilities. Cybersecurity is
                an evolving field, and no solution can provide 100% protection.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">7.3 Limitation of Liability</h3>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CESIUMCYBER SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
                WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                <li>Your use or inability to use the Services</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any security breaches or data incidents</li>
                <li>Any errors or omissions in any content</li>
                <li>Any third-party conduct or content on the Services</li>
              </ul>
              <p className="mb-4">
                IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT PAID BY YOU TO US IN THE TWELVE
                (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Indemnification</h2>
              <p className="mb-4">
                You agree to indemnify, defend, and hold harmless CesiumCyber, its officers, directors,
                employees, agents, and affiliates from and against any claims, liabilities, damages, losses,
                and expenses, including reasonable attorneys&apos; fees, arising out of or in any way connected
                with your access to or use of the Services, your violation of these Terms, or your violation
                of any rights of another.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Professional Services</h2>

              <h3 className="text-xl font-semibold text-cesium mb-3">9.1 Consulting Engagements</h3>
              <p className="mb-4">
                Professional consulting services are subject to separate written agreements that specify
                the scope of work, deliverables, timeline, and pricing. These Terms apply to such engagements
                unless explicitly superseded by the written agreement.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">9.2 Penetration Testing</h3>
              <p className="mb-4">
                Penetration testing services require prior written authorization and a defined scope.
                Unauthorized testing of systems or networks is strictly prohibited and may be illegal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Confidentiality</h2>
              <p className="mb-4">
                We understand that you may share sensitive information with us during the course of our
                Services. We agree to maintain the confidentiality of such information and use it only
                for the purpose of providing our Services, except as required by law or with your consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
              <p className="mb-4">
                We reserve the right to terminate or suspend your access to our Services at any time,
                with or without cause or notice, including for violation of these Terms. Upon termination,
                your right to use the Services will immediately cease.
              </p>
              <p className="mb-4">
                Provisions that by their nature should survive termination shall survive, including but
                not limited to ownership provisions, warranty disclaimers, indemnification, and limitations
                of liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Dispute Resolution</h2>

              <h3 className="text-xl font-semibold text-cesium mb-3">12.1 Governing Law</h3>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the state
                in which CesiumCyber is registered, without regard to its conflict of law provisions.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">12.2 Arbitration</h3>
              <p className="mb-4">
                Any dispute arising out of or relating to these Terms or the Services shall be resolved
                through binding arbitration in accordance with the rules of the American Arbitration
                Association. The arbitration shall take place in the state where CesiumCyber is registered.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">12.3 Class Action Waiver</h3>
              <p className="mb-4">
                You agree that any dispute resolution proceedings will be conducted only on an individual
                basis and not in a class, consolidated, or representative action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. General Provisions</h2>

              <h3 className="text-xl font-semibold text-cesium mb-3">13.1 Entire Agreement</h3>
              <p className="mb-4">
                These Terms, together with our Privacy Policy and any separate written agreements,
                constitute the entire agreement between you and CesiumCyber regarding the Services.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">13.2 Severability</h3>
              <p className="mb-4">
                If any provision of these Terms is found to be unenforceable or invalid, that provision
                shall be limited or eliminated to the minimum extent necessary, and the remaining provisions
                shall remain in full force and effect.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">13.3 Waiver</h3>
              <p className="mb-4">
                Our failure to enforce any right or provision of these Terms shall not constitute a waiver
                of such right or provision.
              </p>

              <h3 className="text-xl font-semibold text-cesium mb-3">13.4 Assignment</h3>
              <p className="mb-4">
                You may not assign or transfer these Terms or your rights hereunder without our prior
                written consent. We may assign these Terms without restriction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-cyber-light p-6 border-l-4 border-cesium">
                <p className="mb-2">
                  <strong className="text-white">Email:</strong>{' '}
                  <a href="mailto:legal@cesiumcyber.com" className="text-cesium hover:underline">
                    legal@cesiumcyber.com
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

            <section className="pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                By using our Services, you acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
