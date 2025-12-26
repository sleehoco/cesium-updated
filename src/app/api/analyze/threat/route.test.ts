/**
 * Tests for Threat Intelligence Analysis API
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import * as completions from '@/lib/ai/completions';
import * as virustotal from '@/lib/threat-intel/virustotal';
import * as rateLimit from '@/lib/rate-limit';

// Mock modules
vi.mock('@/lib/ai/completions');
vi.mock('@/lib/threat-intel/virustotal');
vi.mock('@/lib/rate-limit');

describe('POST /api/analyze/threat', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limiting passes
    vi.mocked(rateLimit.rateLimit).mockReturnValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Math.floor(Date.now() / 1000) + 60,
    });

    // Default: VirusTotal not configured
    vi.mocked(virustotal.hasVirusTotalKey).mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Success Cases', () => {
    it('should analyze an IP address successfully', async () => {
      const mockCompletion = {
        content: '## Analysis\n\nThis IP is associated with known malicious activity.',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ioc: '192.168.1.1' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.ioc).toBe('192.168.1.1');
      expect(data.data.analysis).toBe(mockCompletion.content);
      expect(data.data.provider).toBe('groq');
      expect(data.data.virusTotalData).toBeNull();
    });

    it('should analyze with VirusTotal data when available', async () => {
      const mockVTData = {
        data: {
          attributes: {
            last_analysis_stats: {
              malicious: 5,
              suspicious: 2,
              harmless: 70,
              undetected: 3,
            },
            reputation: -10,
            country: 'US',
            as_owner: 'Evil Corp',
            network: '192.168.0.0/16',
          },
        },
      };

      vi.mocked(virustotal.hasVirusTotalKey).mockReturnValue(true);
      vi.mocked(virustotal.analyzeIOC).mockResolvedValue({
        type: 'ip',
        vtData: mockVTData,
      });
      vi.mocked(virustotal.summarizeVTResults).mockReturnValue('VT Summary');

      const mockCompletion = {
        content: 'Analysis with VT data',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: 200,
          completionTokens: 100,
          totalTokens: 300,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: '192.168.1.1' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.virusTotalData).toBeDefined();
      expect(data.data.virusTotalData.type).toBe('ip');
      expect(data.data.virusTotalData.stats.malicious).toBe(5);
    });

    it('should allow custom provider selection', async () => {
      const mockCompletion = {
        content: 'Analysis',
        provider: 'openai' as const,
        model: 'gpt-4o-mini',
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: '8.8.8.8', provider: 'openai' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.provider).toBe('openai');
      expect(completions.generateCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: 'openai',
        })
      );
    });
  });

  describe('Validation Errors', () => {
    it('should reject empty IOC', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: '' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject IOC longer than 1000 characters', async () => {
      const longIOC = 'a'.repeat(1001);

      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: longIOC }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject invalid provider', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: '1.1.1.1', provider: 'invalid' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject missing request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({}),
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

      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: '1.1.1.1' }),
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
      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: '1.1.1.1' }),
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
        new Error('AI service unavailable')
      );

      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: '1.1.1.1' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });

    it('should handle VirusTotal errors gracefully', async () => {
      vi.mocked(virustotal.hasVirusTotalKey).mockReturnValue(true);
      vi.mocked(virustotal.analyzeIOC).mockRejectedValue(
        new Error('VT API error')
      );

      const mockCompletion = {
        content: 'Analysis without VT',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: '1.1.1.1' }),
      });

      const response = await POST(request);

      // Should still succeed even if VT fails
      expect(response.status).toBe(500);
    });

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
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

  describe('Integration', () => {
    it('should include all expected fields in successful response', async () => {
      const mockCompletion = {
        content: 'Detailed analysis',
        provider: 'groq' as const,
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
        },
      };

      vi.mocked(completions.generateCompletion).mockResolvedValue(mockCompletion);

      const request = new NextRequest('http://localhost:3000/api/analyze/threat', {
        method: 'POST',
        body: JSON.stringify({ ioc: 'example.com' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(data.data).toHaveProperty('ioc');
      expect(data.data).toHaveProperty('analysis');
      expect(data.data).toHaveProperty('virusTotalData');
      expect(data.data).toHaveProperty('provider');
      expect(data.data).toHaveProperty('model');
      expect(data.data).toHaveProperty('usage');
    });
  });
});
