'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { tools } from '@/config/tools-config';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function ToolsPreviewSection() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white font-display mb-4">
            Try Our Free Tools Now
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            No signup required. These tools are free and available right now.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.id} variants={cardVariants}>
                <Link href={tool.path}>
                  <GlassCard glow className="h-full group cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-violet-500/10">
                        <Icon className="h-5 w-5 text-violet-400" />
                      </div>
                      {tool.status === 'new' && (
                        <span className="text-xs font-medium text-green-400 bg-green-500/10 rounded-full px-2.5 py-0.5">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {tool.tagline}
                    </p>
                    <span className="inline-flex items-center text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
                      Launch Tool
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
