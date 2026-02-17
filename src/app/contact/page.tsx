'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContactPage() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    industry: '',
    referralSource: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [charCount, setCharCount] = useState(0);

  // Pre-fill from query params (e.g. /contact?industry=healthcare&service=penetration-testing)
  useEffect(() => {
    const industry = searchParams.get('industry');
    const service = searchParams.get('service');
    if (industry || service) {
      setFormData((prev) => ({
        ...prev,
        ...(industry && { industry }),
        ...(service && { service }),
      }));
    }
  }, [searchParams]);

  // Auto-focus first field on mount
  useEffect(() => {
    const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.focus();
    }
  }, []);

  // Validate fields in real-time
  useEffect(() => {
    const newValidFields: Record<string, boolean> = {};

    if (formData.name.trim().length > 0) {
      newValidFields['name'] = true;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newValidFields['email'] = true;
    }

    if (formData.message.trim().length >= 10) {
      newValidFields['message'] = true;
    }

    setValidFields(newValidFields);
    setCharCount(formData.message.length);
  }, [formData]);

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
        industry: '',
        referralSource: '',
        message: '',
      });
      setValidFields({});
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

  const isFormValid = validFields['name'] && validFields['email'] && validFields['message'];

  const inputClasses = 'w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 transition-all duration-200';
  const selectClasses = 'w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 cursor-pointer';
  const labelClasses = 'block text-sm font-medium text-gray-300 mb-2';

  return (
    <main>
      {/* Header - Dark */}
      <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-display">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300">
              Ready to secure your business? Get in touch with our cybersecurity experts today.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section - Dark */}
      <section className="bg-black py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <Card className="bg-[#121212] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-display">
                    Send us a message
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Success Message */}
                  {success && (
                    <Alert className="mb-4 bg-green-500/10 border-green-500/50 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-200">
                        Thank you for contacting us! We&apos;ll respond within 24 hours.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Error Message */}
                  {error && (
                    <Alert className="mb-4 bg-red-500/10 border-red-500/50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className={labelClasses}>
                        Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Your full name"
                          className={inputClasses}
                        />
                        {validFields['name'] && (
                          <div className="absolute right-3 top-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className={labelClasses}>
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="you@company.com"
                          className={inputClasses}
                        />
                        {validFields['email'] && (
                          <div className="absolute right-3 top-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company Field */}
                    <div>
                      <label htmlFor="company" className={labelClasses}>
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Your company name"
                        className={inputClasses}
                      />
                    </div>

                    {/* Industry Dropdown */}
                    <div>
                      <label htmlFor="industry" className={labelClasses}>
                        Industry
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        disabled={loading}
                        className={selectClasses}
                      >
                        <option value="">Select your industry</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="legal">Legal</option>
                        <option value="financial-services">Financial Services</option>
                        <option value="retail-consumer">Retail/Consumer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Service Field */}
                    <div>
                      <label htmlFor="service" className={labelClasses}>
                        Service Interested In
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        disabled={loading}
                        className={selectClasses}
                      >
                        <option value="">Select a service</option>
                        <option value="security-assessment">Security Assessment</option>
                        <option value="cloud-security-m365">Cloud Security (M365)</option>
                        <option value="penetration-testing">Penetration Testing</option>
                        <option value="security-audit">Security Audit</option>
                        <option value="ai-business-integration">AI Business Integration</option>
                        <option value="ai-security">AI Security &amp; Protection</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* How did you hear about us? */}
                    <div>
                      <label htmlFor="referralSource" className={labelClasses}>
                        How did you hear about us?
                      </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        value={formData.referralSource}
                        onChange={handleChange}
                        disabled={loading}
                        className={selectClasses}
                      >
                        <option value="">Select an option</option>
                        <option value="google-search">Google Search</option>
                        <option value="referral">Referral</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="industry-event">Industry Event</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="message" className={labelClasses}>
                        Message <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Tell us about your security needs..."
                          className={`${inputClasses} resize-none`}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-2">
                          {validFields['message'] && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <span className={`text-xs ${charCount > 2000 ? 'text-red-400' : 'text-gray-400'}`}>
                          {charCount}/2000
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      className="w-full"
                      disabled={loading || !isFormValid}
                    >
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

                  {/* Trust Signals */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Clock className="h-4 w-4 text-violet-400 flex-shrink-0" />
                      <span>We respond within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <ShieldCheck className="h-4 w-4 text-violet-400 flex-shrink-0" />
                      <span>Your information is secure and never shared</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-[#121212] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-display">Contact Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group">
                    <Mail className="h-6 w-6 text-violet-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:information@cesiumcyber.com"
                        className="text-gray-300 hover:text-violet-400 transition-colors"
                      >
                        information@cesiumcyber.com
                      </a>
                      <p className="text-sm text-gray-400 mt-1">We&apos;ll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group">
                    <Phone className="h-6 w-6 text-violet-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone</h3>
                      <a
                        href="tel:+17175434981"
                        className="text-gray-300 hover:text-violet-400 transition-colors"
                      >
                        +1 (717) 543-4981
                      </a>
                      <p className="text-sm text-gray-400 mt-1">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group">
                    <MapPin className="h-6 w-6 text-violet-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Office</h3>
                      <p className="text-gray-300">3500 Cedar Ave</p>
                      <p className="text-gray-300">Columbia, MD 21044</p>
                      <p className="text-gray-300">United States</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#121212] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-display">Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                      <span>Monday - Friday:</span>
                      <span className="text-violet-400 font-semibold">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                      <span>Saturday - Sunday:</span>
                      <span className="text-gray-400">Closed</span>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-sm text-gray-400">
                        For urgent security matters, please email us at{' '}
                        <a
                          href="mailto:information@cesiumcyber.com"
                          className="text-violet-400 hover:underline transition-all"
                        >
                          information@cesiumcyber.com
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
