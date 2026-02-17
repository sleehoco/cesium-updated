'use client';

import { Shield, Compass, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RobotMode } from '@/lib/ai/robot-prompts';

interface ChatModeSelectorProps {
  mode: RobotMode;
  onModeChange: (mode: RobotMode) => void;
}

const modes: { key: RobotMode; label: string; icon: typeof Shield }[] = [
  { key: 'security-quiz', label: 'Quiz', icon: Shield },
  { key: 'tool-walkthrough', label: 'Guide', icon: Compass },
  { key: 'freeform', label: 'Chat', icon: MessageCircle },
];

export function ChatModeSelector({ mode, onModeChange }: ChatModeSelectorProps) {
  return (
    <div className="flex gap-1">
      {modes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onModeChange(key)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
            mode === key
              ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
              : 'text-gray-400 hover:text-gray-300 hover:bg-white/5 border border-transparent'
          )}
          aria-label={`Switch to ${label} mode`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
