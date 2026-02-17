'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, Fish } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const comingSoonFeatures = [
  {
    icon: Shield,
    title: 'Security Scanner',
    description:
      'One-click vulnerability scanning for your websites, APIs, and infrastructure. Get actionable results in minutes, not days.',
    href: '/tools',
  },
  {
    icon: Radio,
    title: 'Threat Feed',
    description:
      'Real-time threat intelligence tailored to your stack. Know about emerging threats before they reach you.',
    href: '/tools/threat-intel',
  },
  {
    icon: Fish,
    title: 'Phishing Challenges',
    description:
      'Train yourself and your team to spot phishing attacks with interactive, gamified simulations.',
    href: '/tools',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export function ComingSoonSection() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    fetch('/api/access/status')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) setUnlocked(true);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-[#050505] py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white font-display mb-4">
            What We&apos;re Building
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powerful security tools that don&apos;t require a security team to use.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {comingSoonFeatures.map((feature) => {
            const Icon = feature.icon;
            const badge = unlocked ? 'Unlocked' : 'Coming Soon';
            const badgeColor = unlocked
              ? 'text-green-400 bg-green-500/10'
              : 'text-violet-400 bg-violet-500/10';

            const card = (
              <GlassCard glow className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-violet-500/10">
                    <Icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <span className={`text-xs font-medium rounded-full px-3 py-1 ${badgeColor}`}>
                    {badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            );

            return (
              <motion.div key={feature.title} variants={cardVariants}>
                {unlocked ? (
                  <a href={feature.href} className="block h-full hover:scale-[1.02] transition-transform">
                    {card}
                  </a>
                ) : (
                  card
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
