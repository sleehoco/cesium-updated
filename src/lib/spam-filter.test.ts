import { describe, it, expect } from 'vitest';
import { checkSpam, MIN_FILL_SECONDS } from './spam-filter';

const legit = {
  name: 'Sarah Whitfield',
  email: 'sarah.whitfield@meridianhealth.org',
  company: 'Meridian Health',
  message:
    'We are a regional healthcare provider and need a HIPAA security assessment before our next audit. Could someone walk us through your process and pricing?',
};

describe('checkSpam', () => {
  describe('legitimate submissions', () => {
    it('passes a normal business inquiry', () => {
      const result = checkSpam(legit);
      expect(result.isSpam).toBe(false);
      expect(result.score).toBe(0);
    });

    it('passes an inquiry that mentions a single URL', () => {
      const result = checkSpam({
        ...legit,
        message:
          'Our site at https://meridianhealth.org failed a scan and we would like a professional review of the findings.',
      });
      expect(result.isSpam).toBe(false);
    });

    it('passes a short name that cannot be gibberish-scored', () => {
      const result = checkSpam({ ...legit, name: 'Li Xu' });
      expect(result.isSpam).toBe(false);
    });

    it('passes a hyphenated or accented name', () => {
      const result = checkSpam({ ...legit, name: 'Renée Fitzgerald-O’Brien' });
      expect(result.isSpam).toBe(false);
    });

    it('passes when no anti-spam fields are supplied at all', () => {
      const result = checkSpam({
        name: legit.name,
        email: legit.email,
        message: legit.message,
      });
      expect(result.isSpam).toBe(false);
    });

    it('passes a form left open in a tab for ten minutes', () => {
      const result = checkSpam({ ...legit, renderedAt: Date.now() - 10 * 60 * 1000 });
      expect(result.isSpam).toBe(false);
    });
  });

  describe('behavioural signals', () => {
    it('flags a filled honeypot on its own', () => {
      const result = checkSpam({ ...legit, honeypot: 'http://spam.example' });
      expect(result.isSpam).toBe(true);
      expect(result.reasons.join()).toContain('honeypot');
    });

    it('ignores an empty or whitespace-only honeypot', () => {
      expect(checkSpam({ ...legit, honeypot: '' }).isSpam).toBe(false);
      expect(checkSpam({ ...legit, honeypot: '   ' }).isSpam).toBe(false);
    });

    it('flags a submission faster than a human could type', () => {
      const result = checkSpam({ ...legit, renderedAt: Date.now() - 500 });
      expect(result.isSpam).toBe(true);
      expect(result.reasons.join()).toContain('submitted in');
    });

    it('allows a submission just past the minimum fill time', () => {
      const result = checkSpam({
        ...legit,
        renderedAt: Date.now() - (MIN_FILL_SECONDS + 1) * 1000,
      });
      expect(result.isSpam).toBe(false);
    });

    it('does not flag on a future timestamp alone', () => {
      // Clock skew is real; worth 2 points, not an outright block.
      const result = checkSpam({ ...legit, renderedAt: Date.now() + 60_000 });
      expect(result.score).toBe(2);
      expect(result.isSpam).toBe(false);
    });
  });

  describe('name-field signals', () => {
    it('flags an email address in the name field', () => {
      const result = checkSpam({ ...legit, name: 'bestseo2024@gmail.com' });
      expect(result.isSpam).toBe(true);
    });

    it('flags a URL in the name field', () => {
      const result = checkSpam({ ...legit, name: 'https://cheap-backlinks.ru' });
      expect(result.isSpam).toBe(true);
    });

    it('flags a gibberish name combined with a link', () => {
      const result = checkSpam({
        ...legit,
        name: 'Xzqkwrtn Bfghjkl',
        message: 'Check https://spam.example for details about our offer today.',
      });
      expect(result.isSpam).toBe(true);
    });
  });

  describe('link and content signals', () => {
    it('flags a message stuffed with links', () => {
      const result = checkSpam({
        ...legit,
        message:
          'Visit https://a.example and https://b.example and also www.c.example for great deals.',
      });
      expect(result.isSpam).toBe(true);
    });

    it('flags BBCode link markup', () => {
      const result = checkSpam({
        ...legit,
        message: 'Great site! [url=http://spam.example]click here[/url] for more info.',
      });
      expect(result.isSpam).toBe(true);
    });

    it('flags SEO pitch language', () => {
      const result = checkSpam({
        ...legit,
        message:
          'We are an SEO expert team that can help you rank higher and build quality backlinks for your website.',
      });
      expect(result.isSpam).toBe(true);
    });

    it('treats a non-Latin message as a signal but never blocks on it alone', () => {
      const result = checkSpam({
        ...legit,
        message: '你好我们提供优质服务，请联系我们了解更多信息。',
      });
      expect(result.reasons.join()).toContain('non-Latin');
      expect(result.isSpam).toBe(false);
    });

    it('flags a non-Latin message that is also stuffed with links', () => {
      const result = checkSpam({
        ...legit,
        message: '优质服务 https://a.example 和 https://b.example',
      });
      expect(result.isSpam).toBe(true);
    });

    it('reports the signals that fired', () => {
      const result = checkSpam({
        ...legit,
        name: 'seo@spam.example',
        message: 'Buy backlinks at https://a.example and https://b.example now.',
      });
      expect(result.reasons.length).toBeGreaterThan(1);
      expect(result.score).toBeGreaterThanOrEqual(5);
    });
  });
});
