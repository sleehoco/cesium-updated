'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        service: '',
        message: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyber-dark via-cyber to-cyber-light">
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-[var(--font-orbitron)]">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300">
            Ready to secure your digital assets? Get in touch with our cybersecurity experts today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-cyber-light/50 border-cesium/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Send us a message</CardTitle>
              <CardDescription className="text-gray-400">
                Fill out the form below and we&apos;ll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Success Message */}
              {success && (
                <Alert className="mb-4 bg-green-500/10 border-green-500/50 rounded-none">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-200">
                    Thank you for contacting us! We&apos;ll respond within 24 hours.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert className="mb-4 bg-red-500/10 border-red-500/50 rounded-none">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-cyber border border-cesium/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cesium disabled:opacity-50"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-cyber border border-cesium/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cesium disabled:opacity-50"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-cyber border border-cesium/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cesium disabled:opacity-50"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-cyber border border-cesium/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cesium disabled:opacity-50"
                  >
                    <option value="">Select a service</option>
                    <option value="security-assessment">Security Assessment</option>
                    <option value="cloud-security-m365">Cloud Security (M365)</option>
                    <option value="penetration-testing">Penetration Testing</option>
                    <option value="security-audit">Security Audit</option>
                    <option value="ai-business-integration">AI Business Integration</option>
                    <option value="ai-security">AI Security & Protection</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-cyber border border-cesium/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cesium resize-none disabled:opacity-50"
                    placeholder="Tell us about your security needs..."
                  />
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-cyber-light/50 border-cesium/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Contact Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-cesium flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a href="mailto:information@cesiumcyber.com" className="text-gray-300 hover:text-cesium transition-colors">
                      information@cesiumcyber.com
                    </a>
                    <p className="text-sm text-gray-400 mt-1">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-cesium flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <a href="tel:+17175434981" className="text-gray-300 hover:text-cesium transition-colors">
                      +1 (717) 543-4981
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-cesium flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Office</h3>
                    <p className="text-gray-300">3500 Cedar Ave</p>
                    <p className="text-gray-300">Columbia, MD 21044</p>
                    <p className="text-gray-300">United States</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cesium/10 border-cesium/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="text-cesium font-semibold">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday:</span>
                    <span className="text-gray-400">Closed</span>
                  </div>
                  <div className="pt-3 border-t border-cesium/20">
                    <p className="text-sm text-gray-400">
                      For urgent security matters, please email us at{' '}
                      <a href="mailto:information@cesiumcyber.com" className="text-cesium hover:underline">
                        information@cesiumcyber.com
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </main>
  );
}
