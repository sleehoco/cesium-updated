'use client';

import { HeroCanvas } from '@/components/three/HeroCanvas';
import { AccessCodeForm } from '@/components/home/AccessCodeForm';

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
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-sm text-violet-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            COMING SOON
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-bold text-white font-display leading-[0.9] tracking-tight">
            Security for{' '}
            <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Everyone
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
            Enterprise-grade protection, made simple. Enter your access code to unlock the full platform.
          </p>

          {/* Access Code Form */}
          <div className="flex justify-center">
            <AccessCodeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
