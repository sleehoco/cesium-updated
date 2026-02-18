'use client';

import { Drawer } from 'vaul';
import { ChatModeSelector } from './ChatModeSelector';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import type { RobotMode } from '@/lib/ai/robot-prompts';
import type { UIMessage } from 'ai';
import type { FormEvent } from 'react';

interface ChatPanelMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: RobotMode;
  onModeChange: (mode: RobotMode) => void;
  messages: UIMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export function ChatPanelMobile({
  open,
  onOpenChange,
  mode,
  onModeChange,
  messages,
  input,
  onInputChange,
  onSubmit,
  isLoading,
}: ChatPanelMobileProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-40 flex flex-col bg-charcoal-900/95 backdrop-blur-xl border-t border-white/[0.08] rounded-t-2xl max-h-[85vh]">
          {/* Drag handle */}
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-white/[0.08]">
            <ChatModeSelector mode={mode} onModeChange={onModeChange} />
            <Drawer.Title className="sr-only">Security Assistant</Drawer.Title>
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
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
