'use client';

import { useRef, type KeyboardEvent, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({ input, onInputChange, onSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as FormEvent);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 px-4 pb-4 pt-2">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          onInputChange(e.target.value);
          // Auto-resize
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ask about security..."
        rows={1}
        className="flex-1 resize-none rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-colors"
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="glass"
        size="icon"
        disabled={!input.trim() || isLoading}
        className="shrink-0 h-9 w-9"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
