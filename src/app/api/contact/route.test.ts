/**
 * Tests for Contact Form API
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockSend = vi.fn();

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

vi.mock('@/lib/rate-limit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/rate-limit')>();
  return {
    ...actual,
    rateLimit: vi.fn(() => ({ allowed: true, remaining: 2 })),
  };
});

// The route reads RESEND_API_KEY at module load, so the env var must be set
// before the dynamic import below.
process.env['RESEND_API_KEY'] = 'test-api-key';

const { POST } = await import('./route');
const rateLimitModule = await import('@/lib/rate-limit');

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

/** A submission that clears every spam heuristic. */
const validSubmission = {
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp',
  message: 'We would like to discuss a security assessment for our web application.',
  renderedAt: Date.now() - 30_000,
};

describe('POST /api/contact', () => {
  beforeEach(() => {
    // The route logs blocked spam and errors; keep test output readable.
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(rateLimitModule.rateLimit).mockReturnValue({ allowed: true, remaining: 2 });
    mockSend.mockResolvedValue({ data: { id: 'email-id-123' }, error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Success cases', () => {
    it('sends the contact email and returns success', async () => {
      const response = await POST(makeRequest(validSubmission));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.emailId).toBe('email-id-123');
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('accepts a submission with no optional or anti-spam fields', async () => {
      const response = await POST(
        makeRequest({
          name: 'Jane Smith',
          email: 'jane@company.com',
          message: 'We need penetration testing for our internal network.',
        })
      );

      expect(response.status).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('escapes HTML in user input before putting it in the email', async () => {
      await POST(
        makeRequest({
          ...validSubmission,
          name: '<script>alert(1)</script>',
        })
      );

      const html = mockSend.mock.calls[0]![0].html as string;
      expect(html).not.toContain('<script>alert(1)</script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('Spam filtering', () => {
    it('silently drops a submission with the honeypot filled', async () => {
      const response = await POST(
        makeRequest({ ...validSubmission, website: 'http://spam.example' })
      );
      const data = await response.json();

      // Looks identical to success so the bot learns nothing.
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('silently drops a submission filled out faster than a human could', async () => {
      const response = await POST(
        makeRequest({ ...validSubmission, renderedAt: Date.now() - 200 })
      );

      expect(response.status).toBe(200);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('silently drops an email address in the name field', async () => {
      const response = await POST(
        makeRequest({ ...validSubmission, name: 'bestseo2024@gmail.com' })
      );

      expect(response.status).toBe(200);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('silently drops link-stuffed SEO spam', async () => {
      const response = await POST(
        makeRequest({
          ...validSubmission,
          message:
            'We build quality backlinks. See https://a.example and https://b.example and www.c.example.',
        })
      );

      expect(response.status).toBe(200);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('does not drop a genuine inquiry that happens to include a link', async () => {
      const response = await POST(
        makeRequest({
          ...validSubmission,
          message:
            'Our site at https://acme.example failed a vulnerability scan and we need help reviewing the findings.',
        })
      );

      expect(response.status).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation errors', () => {
    it.each([
      ['empty name', { ...validSubmission, name: '' }],
      ['invalid email', { ...validSubmission, email: 'invalid-email' }],
      ['message under 10 characters', { ...validSubmission, message: 'Short' }],
      ['message over 2000 characters', { ...validSubmission, message: 'a'.repeat(2001) }],
      ['name over 100 characters', { ...validSubmission, name: 'a'.repeat(101) }],
      ['company over 100 characters', { ...validSubmission, company: 'a'.repeat(101) }],
      ['missing required fields', { name: 'Test User' }],
    ])('rejects %s', async (_label, body) => {
      const response = await POST(makeRequest(body));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid form data');
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('Rate limiting', () => {
    it('returns 429 when the limit is exceeded', async () => {
      vi.mocked(rateLimitModule.rateLimit).mockReturnValue({ allowed: false, remaining: 0 });

      const response = await POST(makeRequest(validSubmission));
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Too many requests');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('applies a 3-per-15-minute per-IP limit', async () => {
      await POST(makeRequest(validSubmission));

      expect(rateLimitModule.rateLimit).toHaveBeenCalledWith(
        expect.stringContaining('contact:'),
        3,
        15 * 60 * 1000
      );
    });
  });

  describe('Email service errors', () => {
    it('returns 500 when Resend reports an error', async () => {
      mockSend.mockResolvedValue({ data: null, error: { message: 'API rate limit exceeded' } });

      const response = await POST(makeRequest(validSubmission));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('temporarily unavailable');
    });

    it('returns 500 when sending throws', async () => {
      mockSend.mockRejectedValue(new Error('Network error'));

      const response = await POST(makeRequest(validSubmission));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('handles malformed JSON', async () => {
      const response = await POST(makeRequest('invalid json'));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(mockSend).not.toHaveBeenCalled();
    });
  });
});
