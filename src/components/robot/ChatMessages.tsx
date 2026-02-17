'use client';

import { useEffect, useRef, type AnchorHTMLAttributes, type HTMLAttributes, type OlHTMLAttributes } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { UIMessage } from 'ai';

// Custom markdown renderers for consistent styling in the chat
const markdownComponents = {
  a: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href?.startsWith('/');
    return (
      <a
        href={href}
        className="text-violet-400 underline hover:text-violet-300 transition-colors"
        {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}
      >
        {children}
      </a>
    );
  },
  p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-1.5 leading-relaxed" {...props}>{children}</p>
  ),
  strong: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-white" {...props}>{children}</strong>
  ),
  ul: ({ children, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-1.5 ml-4 list-disc space-y-0.5" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="my-1.5 ml-4 list-decimal space-y-0.5" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>{children}</li>
  ),
  h3: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-sm font-semibold text-white mt-3 mb-1" {...props}>{children}</h3>
  ),
  h4: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-sm font-semibold text-white mt-2 mb-1" {...props}>{children}</h4>
  ),
  code: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
    <code className="text-violet-300 bg-white/5 px-1 py-0.5 rounded text-xs" {...props}>{children}</code>
  ),
  pre: ({ children, ...props }: HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-2 p-2 bg-black/30 rounded-lg overflow-x-auto text-xs" {...props}>{children}</pre>
  ),
};

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

function getTextContent(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return '';
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

function StreamingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
      {messages.map((message) => {
        const text = getTextContent(message);
        if (!text) return null;

        return (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={
                message.role === 'user'
                  ? 'max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2.5 bg-violet-600/20 border border-violet-500/20 text-sm text-gray-200'
                  : 'max-w-[85%] rounded-2xl rounded-bl-md px-3.5 py-2.5 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] text-sm text-gray-300'
              }
            >
              {message.role === 'assistant' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {text}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{text}</p>
              )}
            </div>
          </div>
        );
      })}
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-md bg-white/[0.03] backdrop-blur-sm border border-white/[0.08]">
            <StreamingIndicator />
          </div>
        </div>
      )}
    </div>
  );
}
