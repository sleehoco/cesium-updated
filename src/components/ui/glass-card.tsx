import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 transition-all duration-300',
          glow && 'hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = 'GlassCard';

export { GlassCard };
