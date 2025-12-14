/**
 * Tests for AI Writing Assistant API
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import * as completions from '@/lib/ai/completions';
import * as rateLimit from '@/lib/rate-limit';

// Mock modules
vi.mock('@/lib/ai/completions');
vi.mock('@/lib/rate-limit');

describe('POST /api/analyze/writing', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limiting passes
    vi.mocked(rateLimit.rateLimit).mockReturnValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Math.floor(Date.now() / 1000) + 60,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Success Cases - Review Mode', () => {
    it('should review text successfully', async () => {
      const mockCompletion = {
        content: '## Corrected Text\n\nYour text has been reviewed.',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: 50,
          completionTokens: 100,
          totalTokens: 150,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'This is a test sentence with some erors.',
          mode: 'review',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.result).toBe(mockCompletion.content);
      expect(data.data.provider).toBe('groq');
    });
  });

  describe('Success Cases - Compose Email Mode', () => {
    it('should compose professional email successfully', async () => {
      const mockCompletion = {
        content: '**Subject:** Meeting Request\n\nDear Team,\n\nI hope this email finds you well...',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: 60,
          completionTokens: 200,
          totalTokens: 260,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Write an email requesting a team meeting next week to discuss project updates',
          mode: 'compose-email',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.result).toContain('Subject');
    });

    it('should use lower temperature for email composition', async () => {
      const mockCompletion = {
        content: 'Professional email',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: { promptTokens: 50, completionTokens: 50, totalTokens: 100 },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Request meeting',
          mode: 'compose-email',
        }),
      });

      await POST(request);

      expect(completions.generateCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature: 0.3,
        })
      );
    });
  });

  describe('Success Cases - Formalize Mode', () => {
    it('should formalize casual text successfully', async () => {
      const mockCompletion = {
        content: 'I am writing to formally request your assistance with this matter.',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: 40,
          completionTokens: 80,
          totalTokens: 120,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Hey can you help me with this thing?',
          mode: 'formalize',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.result).toBeTruthy();
    });
  });

  describe('Validation Errors', () => {
    it('should reject empty text', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: '',
          mode: 'review',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject text longer than 10000 characters', async () => {
      const longText = 'a'.repeat(10001);

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: longText,
          mode: 'review',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject invalid mode', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Test text',
          mode: 'invalid-mode',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject missing mode', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Test text',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject missing text', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          mode: 'review',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should reject requests when rate limit exceeded', async () => {
      vi.mocked(rateLimit.rateLimit).mockReturnValue({
        success: false,
        limit: 10,
        remaining: 0,
        reset: Math.floor(Date.now() / 1000) + 60,
      });

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Test text',
          mode: 'review',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('Too many requests');
      expect(response.headers.get('X-RateLimit-Limit')).toBe('10');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response.headers.get('Retry-After')).toBeDefined();
    });

    it('should apply AI endpoint rate limit configuration', async () => {
      const mockCompletion = {
        content: 'Result',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: { promptTokens: 50, completionTokens: 50, totalTokens: 100 },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Test',
          mode: 'review',
        }),
      });

      await POST(request);

      expect(rateLimit.rateLimit).toHaveBeenCalledWith(
        request,
        expect.objectContaining({
          limit: 10,
          windowSeconds: 60,
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle AI completion errors gracefully', async () => {
      vi.mocked(completions.generateCompletion).mockRejectedValue(
        new Error('AI service error')
      );

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Test text',
          mode: 'review',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('Response Structure', () => {
    it('should include all expected fields in successful response', async () => {
      const mockCompletion = {
        content: 'Corrected text',
        provider: 'together' as const,
        model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
        usage: {
          promptTokens: 100,
          completionTokens: 150,
          totalTokens: 250,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
        method: 'POST',
        body: JSON.stringify({
          text: 'Test text for review',
          mode: 'review',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(data.data).toHaveProperty('text');
      expect(data.data).toHaveProperty('mode');
      expect(data.data).toHaveProperty('result');
      expect(data.data).toHaveProperty('provider');
      expect(data.data).toHaveProperty('model');
    });
  });

  describe('Mode-Specific Behavior', () => {
    it('should use appropriate system prompt for each mode', async () => {
      const mockCompletion = {
        content: 'Result',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: { promptTokens: 50, completionTokens: 50, totalTokens: 100 },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const modes: Array<'review' | 'compose-email' | 'formalize'> = [
        'review',
        'compose-email',
        'formalize',
      ];

      for (const mode of modes) {
        vi.clearAllMocks();

        const request = new NextRequest('http://localhost:3000/api/analyze/writing', {
          method: 'POST',
          body: JSON.stringify({
            text: 'Test text',
            mode,
          }),
        });

        await POST(request);

        expect(completions.generateCompletion).toHaveBeenCalledWith(
          expect.objectContaining({
            systemPrompt: expect.any(String),
            userMessage: expect.any(String),
          })
        );
      }
    });
  });
});
