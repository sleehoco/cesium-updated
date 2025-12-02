'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [charCount, setCharCount] = useState(0);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      } as const,
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyber-dark via-cyber to-cyber-light relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cesium/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-[var(--font-orbitron)] bg-gradient-to-r from-white via-cesium to-white bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300">
            Ready to secure your digital assets? Get in touch with our cybersecurity experts today.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <Card className="bg-cyber-light/50 border-cesium/20 backdrop-blur-xl shadow-2xl hover:shadow-cesium/10 transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-cesium" />
                  Send us a message
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form below and we&apos;ll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      variants={successVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <Alert className="mb-4 bg-green-500/10 border-green-500/50 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-200">
                          Thank you for contacting us! We&apos;ll respond within 24 hours.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <Alert className="mb-4 bg-red-500/10 border-red-500/50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-200">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="relative group">
                    <motion.label
                      htmlFor="name"
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'name' || formData.name
                        ? '-top-2.5 text-xs bg-cyber-light px-2 text-cesium'
                        : 'top-2.5 text-sm text-gray-400'
                        }`}
                    >
                      Name *
                    </motion.label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-cyber border border-cesium/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cesium focus:border-transparent disabled:opacity-50 transition-all duration-200 group-hover:border-cesium/50"
                    />
                    {validFields['name'] && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-3"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative group">
                    <motion.label
                      htmlFor="email"
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'email' || formData.email
                        ? '-top-2.5 text-xs bg-cyber-light px-2 text-cesium'
                        : 'top-2.5 text-sm text-gray-400'
                        }`}
                    >
                      Email *
                    </motion.label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-cyber border border-cesium/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cesium focus:border-transparent disabled:opacity-50 transition-all duration-200 group-hover:border-cesium/50"
                    />
                    {validFields['email'] && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-3"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>

                  {/* Company Field */}
                  <div className="relative group">
                    <motion.label
                      htmlFor="company"
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'company' || formData.company
                        ? '-top-2.5 text-xs bg-cyber-light px-2 text-cesium'
                        : 'top-2.5 text-sm text-gray-400'
                        }`}
                    >
                      Company
                    </motion.label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-cyber border border-cesium/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cesium focus:border-transparent disabled:opacity-50 transition-all duration-200 group-hover:border-cesium/50"
                    />
                  </div>

                  {/* Service Field */}
                  <div className="relative group">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-cyber border border-cesium/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cesium focus:border-transparent disabled:opacity-50 transition-all duration-200 group-hover:border-cesium/50 cursor-pointer"
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

                  {/* Message Field */}
                  <div className="relative group">
                    <motion.label
                      htmlFor="message"
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'message' || formData.message
                        ? '-top-2.5 text-xs bg-cyber-light px-2 text-cesium'
                        : 'top-2.5 text-sm text-gray-400'
                        }`}
                    >
                      Message *
                    </motion.label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className="w-full px-4 py-3 pt-4 bg-cyber border border-cesium/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cesium focus:border-transparent resize-none disabled:opacity-50 transition-all duration-200 group-hover:border-cesium/50"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-2">
                        {validFields['message'] && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-xs ${charCount > 2000 ? 'text-red-400' : 'text-gray-400'}`}>
                        {charCount}/2000
                      </span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={isFormValid && !loading ? { scale: 1.02 } : {}}
                    whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
                  >
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      className={`w-full transition-all duration-300 ${isFormValid && !loading ? 'animate-pulse' : ''
                        }`}
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
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="bg-cyber-light/50 border-cesium/20 backdrop-blur-xl shadow-2xl hover:shadow-cesium/10 transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Contact Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-cesium/5 transition-colors duration-200 cursor-pointer group"
                    whileHover={{ x: 5 }}
                  >
                    <Mail className="h-6 w-6 text-cesium flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:information@cesiumcyber.com"
                        className="text-gray-300 hover:text-cesium transition-colors relative group"
                      >
                        information@cesiumcyber.com
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cesium group-hover:w-full transition-all duration-300" />
                      </a>
                      <p className="text-sm text-gray-400 mt-1">We&apos;ll respond within 24 hours</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-cesium/5 transition-colors duration-200 cursor-pointer group"
                    whileHover={{ x: 5 }}
                  >
                    <Phone className="h-6 w-6 text-cesium flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone</h3>
                      <a
                        href="tel:+17175434981"
                        className="text-gray-300 hover:text-cesium transition-colors relative group"
                      >
                        +1 (717) 543-4981
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cesium group-hover:w-full transition-all duration-300" />
                      </a>
                      <p className="text-sm text-gray-400 mt-1">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-cesium/5 transition-colors duration-200 group"
                    whileHover={{ x: 5 }}
                  >
                    <MapPin className="h-6 w-6 text-cesium flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Office</h3>
                      <p className="text-gray-300">3500 Cedar Ave</p>
                      <p className="text-gray-300">Columbia, MD 21044</p>
                      <p className="text-gray-300">United States</p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cesium/10 to-cesium/5 border-cesium/30 backdrop-blur-xl shadow-2xl hover:shadow-cesium/20 transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="text-white">Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                      <span>Monday - Friday:</span>
                      <span className="text-cesium font-semibold">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                      <span>Saturday - Sunday:</span>
                      <span className="text-gray-400">Closed</span>
                    </div>
                    <div className="pt-3 border-t border-cesium/20">
                      <p className="text-sm text-gray-400">
                        For urgent security matters, please email us at{' '}
                        <a
                          href="mailto:information@cesiumcyber.com"
                          className="text-cesium hover:underline transition-all"
                        >
                          information@cesiumcyber.com
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
