'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { AccessCodeForm } from '@/components/home/AccessCodeForm';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section id="access" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* WebGL Background */}
      <HeroCanvas />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Now Live Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            NOW LIVE
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-bold text-white font-display leading-[0.9] tracking-tight">
            Build Your Own{' '}
            <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
            Free AI security tools you can use right now. No subscriptions, no hosting, no monthly fees — just results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="accent" size="lg" asChild>
              <Link href="/tools/prompt-injection-scanner">
                Try the Prompt Injection Scanner
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link href="/tools">
                Explore All Tools
              </Link>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-xs mx-auto">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-gray-500">or enter your access code</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Access Code Form */}
          <div className="flex justify-center">
            <AccessCodeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
