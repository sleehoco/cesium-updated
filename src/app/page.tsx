import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Brain, Shield, Zap, Eye, Network, Sparkles } from 'lucide-react';
import { CyberGrid } from '@/components/shared/CyberGrid';

export default function HomePage() {
  return (
    <>
      <CyberGrid />
      <main className="relative min-h-screen">
        {/* Hero Section - Asymmetric, Bold */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-black to-cyber opacity-90"></div>

          {/* Diagonal accent */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-cesium/10 to-transparent transform skew-x-12"></div>

          <div className="container relative z-10 mx-auto px-4 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-cesium/20 text-cesium text-sm font-mono border border-cesium/40 rounded-sm backdrop-blur">
                    AI-Powered Cyber Defense
                  </span>
                </div>

                <h1 className="text-7xl lg:text-8xl font-black text-white font-[var(--font-orbitron)] leading-none tracking-tight">
                  CESIUM
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cesium via-gold-light to-cesium animate-shimmer bg-[length:200%_100%]">
                    CYBER
                  </span>
                </h1>

                <p className="text-2xl text-gray-300 font-light max-w-xl leading-relaxed">
                  Neural threat detection meets autonomous response.
                  <span className="text-cesium font-semibold"> Protect at machine speed.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-cesium hover:bg-cesium-dark text-black font-bold text-lg px-8 py-6 rounded-none border-2 border-cesium shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
                    asChild
                  >
                    <Link href="/contact">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Deploy AI Defense
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-cesium/50 text-cesium hover:bg-cesium/10 font-semibold text-lg px-8 py-6 rounded-none backdrop-blur"
                    asChild
                  >
                    <Link href="/services">Explore Systems</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-cesium/20">
                  {[
                    { value: '99.9%', label: 'Threat Detection' },
                    { value: '<1ms', label: 'Response Time' },
                    { value: '24/7', label: 'AI Monitoring' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-3xl font-bold text-cesium font-mono">{stat.value}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Visual Element */}
              <div className="relative hidden lg:block">
                <div className="relative w-full aspect-square">
                  {/* Neural network visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-96 h-96">
                      {/* Center core */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-cesium to-gold-dark flex items-center justify-center animate-pulse">
                        <Brain className="w-16 h-16 text-cyber-dark" />
                      </div>

                      {/* Orbiting nodes */}
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <div
                          key={angle}
                          className="absolute w-4 h-4 rounded-full bg-cesium animate-pulse"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${angle}deg) translateY(-160px)`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}

                      {/* Connection lines */}
                      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="160"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="1"
                          strokeDasharray="5,5"
                          className="animate-spin"
                          style={{ animationDuration: '20s' }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(212,175,55,0.3)" />
                            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Services Grid - Brutal, Asymmetric */}
        <section className="relative py-32 bg-gradient-to-b from-black to-cyber-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 font-[var(--font-orbitron)]">
                SECURITY <span className="text-cesium">SERVICES</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Comprehensive cybersecurity solutions to protect your business and identify vulnerabilities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Security Assessment',
                  description: 'Identify vulnerabilities and strengthen your defense posture with thorough security assessments.',
                  accent: 'from-purple-500 to-pink-500',
                },
                {
                  icon: Network,
                  title: 'Cloud Security (M365)',
                  description: 'Secure your Microsoft 365 environment with expert configuration reviews and compliance monitoring.',
                  accent: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Zap,
                  title: 'Penetration Testing',
                  description: 'Simulate real-world attacks to identify security gaps before malicious actors do.',
                  accent: 'from-orange-500 to-red-500',
                },
                {
                  icon: Eye,
                  title: 'Security Audit',
                  description: 'Ensure compliance and security with comprehensive audits of policies and controls.',
                  accent: 'from-green-500 to-emerald-500',
                },
                {
                  icon: Brain,
                  title: 'AI Business Integration',
                  description: 'Transform operations with intelligent automation and custom AI solutions tailored to your needs.',
                  accent: 'from-indigo-500 to-blue-500',
                },
                {
                  icon: Sparkles,
                  title: 'AI Security & Protection',
                  description: 'Protect your AI systems and defend against emerging AI-powered threats.',
                  accent: 'from-teal-500 to-green-500',
                },
              ].map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={service.title}
                    className="group relative bg-cyber-light/30 border-2 border-cesium/20 backdrop-blur hover:border-cesium transition-all duration-500 overflow-hidden rounded-none"
                    style={{
                      transform: index % 2 === 0 ? 'translateY(0)' : 'translateY(20px)',
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                    <CardHeader className="relative z-10">
                      <div className="mb-4">
                        <Icon className="h-12 w-12 text-cesium group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <CardTitle className="text-white text-xl font-bold">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <CardDescription className="text-gray-400 leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA - Bold, Diagonal */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cesium via-gold-light to-cesium-dark opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cesium to-transparent"></div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-5xl lg:text-7xl font-black text-white font-[var(--font-orbitron)] leading-tight">
                READY TO
                <br />
                <span className="text-cesium">SECURE YOUR FUTURE?</span>
              </h2>
              <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
                Protect your business with expert cybersecurity and harness AI to drive growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Button
                  size="lg"
                  className="bg-cesium hover:bg-cesium-dark text-black font-black text-xl px-12 py-8 rounded-none border-4 border-cesium shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all"
                  asChild
                >
                  <Link href="/contact">START NOW</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-4 border-white/20 text-white hover:bg-white/10 font-bold text-xl px-12 py-8 rounded-none backdrop-blur"
                  asChild
                >
                  <Link href="/about">MEET THE TEAM</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
