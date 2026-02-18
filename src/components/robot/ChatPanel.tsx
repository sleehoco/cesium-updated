'use client';

import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatModeSelector } from './ChatModeSelector';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import type { RobotMode } from '@/lib/ai/robot-prompts';
import type { UIMessage } from 'ai';
import type { FormEvent } from 'react';

interface ChatPanelProps {
  mode: RobotMode;
  onModeChange: (mode: RobotMode) => void;
  messages: UIMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  onClose: () => void;
}

export function ChatPanel({
  mode,
  onModeChange,
  messages,
  input,
  onInputChange,
  onSubmit,
  isLoading,
  onClose,
}: ChatPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed bottom-24 right-6 w-[380px] max-h-[520px] flex flex-col bg-charcoal-900/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-violet-500/10 overflow-hidden z-40"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
        <ChatModeSelector mode={mode} onModeChange={onModeChange} />
        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages messages={messages} isLoading={isLoading} />

      {/* Input */}
      <div className="border-t border-white/[0.08]">
        <ChatInput
          input={input}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </motion.div>
  );
}
