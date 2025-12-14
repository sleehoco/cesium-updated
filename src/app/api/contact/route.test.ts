/**
 * Tests for Contact Form API
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import * as rateLimit from '@/lib/rate-limit';

// Create mock function for send
const mockSend = vi.fn();

// Mock Resend
vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: mockSend,
    };
  },
}));

vi.mock('@/lib/rate-limit');

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limiting passes
    vi.mocked(rateLimit.rateLimit).mockReturnValue({
      success: true,
      limit: 3,
      remaining: 2,
      reset: Math.floor(Date.now() / 1000) + 300,
    });

    // Set up environment
    process.env.RESEND_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.RESEND_API_KEY;
  });

  describe('Success Cases', () => {
    it('should send contact form email successfully', async () => {
      mockSend.mockResolvedValue({
        data: { id: 'email-id-123' },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message that meets the minimum length requirement.',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Message sent successfully');
    });

    it('should accept optional company and service fields', async () => {
      mockSend.mockResolvedValue({
        data: { id: 'email-id-123' },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Jane Smith',
          email: 'jane@company.com',
          company: 'Acme Corp',
          service: 'Penetration Testing',
          message: 'We need penetration testing services for our web application.',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should accept empty optional fields', async () => {
      mockSend.mockResolvedValue({
        data: { id: 'email-id-123' },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          company: '',
          service: '',
          message: 'Message without company or service selection.',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('Validation Errors', () => {
    it('should reject empty name', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          email: 'test@example.com',
          message: 'Test message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message that is long enough',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject message shorter than 10 characters', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Short',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('10 characters');
    });

    it('should reject message longer than 2000 characters', async () => {
      const longMessage = 'a'.repeat(2001);

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: longMessage,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject name longer than 100 characters', async () => {
      const longName = 'a'.repeat(101);

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: longName,
          email: 'test@example.com',
          message: 'Valid message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject company longer than 100 characters', async () => {
      const longCompany = 'a'.repeat(101);

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          company: longCompany,
          message: 'Valid message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          // Missing email and message
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
        limit: 3,
        remaining: 0,
        reset: Math.floor(Date.now() / 1000) + 300,
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('Too many contact attempts');
      expect(response.headers.get('X-RateLimit-Limit')).toBe('3');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response.headers.get('Retry-After')).toBeDefined();
    });

    it('should apply strict contact form rate limit (3 req per 5 min)', async () => {
      mockSend.mockResolvedValue({
        data: { id: 'email-id-123' },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test',
          email: 'test@example.com',
          message: 'Test message',
        }),
      });

      await POST(request);

      expect(rateLimit.rateLimit).toHaveBeenCalledWith(
        request,
        expect.objectContaining({
          limit: 3,
          windowSeconds: 300,
        })
      );
    });
  });

  describe('Resend Configuration', () => {
    it('should return 503 when Resend is not configured', async () => {
      delete process.env.RESEND_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Email service is not configured');
      expect(data.error).toContain('information@cesiumcyber.com');
    });
  });

  describe('Email Service Errors', () => {
    it('should handle Resend API errors gracefully', async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'API rate limit exceeded' },
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should handle network errors when sending email', async () => {
      mockSend.mockRejectedValue(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
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

    it('should handle unexpected errors', async () => {
      mockSend.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('Response Structure', () => {
    it('should return correct structure on success', async () => {
      mockSend.mockResolvedValue({
        data: { id: 'email-id-123' },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message here',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('message');
      expect(data.success).toBe(true);
    });

    it('should return correct structure on error', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          email: 'invalid',
          message: 'short',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('error');
      expect(data.error).toBeTruthy();
    });
  });
});
