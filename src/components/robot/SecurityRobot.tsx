'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChatPanel } from './ChatPanel';
import { ChatPanelMobile } from './ChatPanelMobile';
import { WELCOME_MESSAGES, type RobotMode } from '@/lib/ai/robot-prompts';

const RobotCanvas = dynamic(
  () => import('./RobotCanvas').then((mod) => ({ default: mod.RobotCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-violet-500/30 animate-pulse" />
      </div>
    ),
  }
);

function makeWelcomeMessage(mode: RobotMode) {
  return {
    id: 'welcome',
    role: 'assistant' as const,
    parts: [{ type: 'text' as const, text: WELCOME_MESSAGES[mode] }],
  };
}

export function SecurityRobot() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mode, setMode] = useState<RobotMode>('freeform');
  const [input, setInput] = useState('');

  // Use a ref-like approach so the transport always uses current mode
  const modeRef = { current: mode };
  modeRef.current = mode;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({ mode: modeRef.current }),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    messages: [makeWelcomeMessage(mode)],
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleModeChange = useCallback(
    (newMode: RobotMode) => {
      setMode(newMode);
      setMessages([makeWelcomeMessage(newMode)]);
      setInput('');
    },
    [setMessages]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      sendMessage({ text: input.trim() });
      setInput('');
    },
    [input, isLoading, sendMessage]
  );

  const handleMobileOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* 3D Robot Button */}
      <RobotCanvas chatOpen={open} onClick={handleToggle} />

      {/* Chat Panel */}
      {isMobile ? (
        <ChatPanelMobile
          open={open}
          onOpenChange={handleMobileOpenChange}
          mode={mode}
          onModeChange={handleModeChange}
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      ) : (
        <AnimatePresence>
          {open && (
            <ChatPanel
              mode={mode}
              onModeChange={handleModeChange}
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
