'use client';

import { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import DOMPurify from 'dompurify';

interface SafeMarkdownProps {
  content: string;
  components?: Partial<Components>;
  className?: string;
}

/**
 * Safe Markdown Component
 * Wraps ReactMarkdown with DOMPurify sanitization for extra security
 *
 * While ReactMarkdown is safe by default (doesn't allow HTML unless rehypeRaw is used),
 * this component provides belt-and-suspenders protection by:
 * 1. Sanitizing content before rendering
 * 2. Stripping any potentially dangerous markdown patterns
 * 3. Providing a consistent, secure markdown rendering interface
 */
export function SafeMarkdown({ content, components, className }: SafeMarkdownProps) {
  // Sanitize content using DOMPurify
  // This strips any HTML tags and potentially malicious content
  const sanitizedContent = useMemo(() => {
    // DOMPurify is designed for HTML, but we use it here to catch any
    // edge cases where markdown might be interpreted as HTML
    // We use ALLOWED_TAGS: [] to strip all HTML, leaving only text
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [], // No HTML tags allowed - pure text and markdown only
      ALLOWED_ATTR: [], // No attributes allowed
      KEEP_CONTENT: true, // Keep the text content
    });

    return sanitized;
  }, [content]);

  return (
    <div className={className}>
      <ReactMarkdown
        components={components}
        // ReactMarkdown is configured to NOT allow HTML by default
        // We don't use rehypeRaw plugin, so no HTML will be rendered
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}
