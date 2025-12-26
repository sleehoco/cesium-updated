/**
 * AI Prompt Injection Protection
 * Sanitizes user input to prevent prompt injection attacks
 */

/**
 * Sanitize user input before sending to AI models
 * Prevents prompt injection by filtering/escaping malicious patterns
 */
export function sanitizePromptInput(input: string): string {
  let sanitized = input;

  // Remove system-like commands and role markers
  const dangerousPatterns = [
    /SYSTEM:/gi,
    /ASSISTANT:/gi,
    /USER:/gi,
    /WOPR:/gi,
    /ANALYST:/gi,
    /AI:/gi,
    /\[SYSTEM\]/gi,
    /\[ASSISTANT\]/gi,
    /ignore\s+(previous|all|above)\s+instructions/gi,
    /disregard\s+(previous|all|above)\s+instructions/gi,
    /forget\s+(previous|all|above)\s+instructions/gi,
    /new\s+instructions?:/gi,
    /override\s+instructions/gi,
    /you\s+are\s+now/gi,
    /pretend\s+to\s+be/gi,
    /act\s+as\s+if/gi,
    /simulate\s+being/gi,
  ];

  // Replace dangerous patterns with sanitized versions
  dangerousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  });

  // Limit consecutive newlines to prevent format injection
  sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n');

  // Remove excessive whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Escape special characters that could be used for injection
 */
export function escapePromptSpecialChars(input: string): string {
  return input
    .replace(/```/g, '\'\'\'')  // Escape code blocks
    .replace(/\$\{/g, '\\${')    // Escape template literals
    .replace(/\`/g, '\'');        // Escape backticks
}

/**
 * Full sanitization for AI prompts
 * Combines all sanitization methods
 */
export function fullSanitize(input: string): string {
  const step1 = sanitizePromptInput(input);
  const step2 = escapePromptSpecialChars(step1);
  return step2;
}
