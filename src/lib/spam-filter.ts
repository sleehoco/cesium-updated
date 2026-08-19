/**
 * Heuristic spam scoring for public form submissions.
 *
 * Every signal is content- or behaviour-based, so there is no third-party
 * dependency and no visible challenge for real visitors. Signals are additive:
 * a submission is rejected once its score reaches SPAM_THRESHOLD, so a single
 * weak signal never blocks a legitimate inquiry on its own.
 */

export const SPAM_THRESHOLD = 5;

/** Minimum seconds a human plausibly needs to fill out the contact form. */
export const MIN_FILL_SECONDS = 3;

/** A stale form (tab left open) is not evidence of spam; ignore beyond this. */
const MAX_FORM_AGE_SECONDS = 24 * 60 * 60;

export interface SpamCheckInput {
  name: string;
  email: string;
  company?: string | undefined;
  message: string;
  /** Honeypot field. Hidden from humans, so any value is bot-authored. */
  honeypot?: string | undefined;
  /** Epoch ms when the form was rendered in the browser. */
  renderedAt?: number | undefined;
}

export interface SpamCheckResult {
  isSpam: boolean;
  score: number;
  /** Human-readable signals, for server logs only. Never returned to clients. */
  reasons: string[];
}

const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const BBCODE_PATTERN = /\[(?:url|link)[\]=]/i;
const MARKDOWN_LINK_PATTERN = /\[[^\]]+\]\([^)]+\)/;

/** Terms typical of SEO / backlink / crypto blast campaigns. */
const SPAM_PHRASES = [
  'seo service',
  'seo expert',
  'search engine ranking',
  'rank your site',
  'rank higher',
  'first page of google',
  'top of google',
  'backlink',
  'link building',
  'guest post',
  'domain authority',
  'web design service',
  'increase traffic',
  'boost traffic',
  'digital marketing service',
  'social media marketing',
  'crypto',
  'bitcoin',
  'forex',
  'binary option',
  'casino',
  'viagra',
  'cialis',
  'escort service',
  'loan offer',
  'make money online',
  'work from home',
  'weight loss',
  'buy followers',
  'lead generation service',
  'this is not spam',
];

function countMatches(text: string, pattern: RegExp): number {
  return (text.match(pattern) ?? []).length;
}

/**
 * A name is "gibberish" if it reads like keyboard mashing rather than a word:
 * too few vowels, or an implausibly long consonant run.
 */
function looksLikeGibberish(value: string): boolean {
  const letters = value.toLowerCase().replace(/[^a-z]/g, '');
  if (letters.length < 6) return false;

  const vowels = countMatches(letters, /[aeiouy]/g);
  const vowelRatio = vowels / letters.length;
  if (vowelRatio < 0.2) return true;

  return /[bcdfghjklmnpqrstvwxz]{5,}/.test(letters);
}

/** Proportion of characters outside the Latin and Latin-Extended ranges. */
function nonLatinRatio(value: string): number {
  const stripped = value.replace(/\s/g, '');
  if (stripped.length === 0) return 0;
  const nonLatin = countMatches(stripped, /[^ -ɏ]/g);
  return nonLatin / stripped.length;
}

export function checkSpam(input: SpamCheckInput): SpamCheckResult {
  const reasons: string[] = [];
  let score = 0;

  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(`${reason} (+${points})`);
  };

  const name = input.name.trim();
  const message = input.message.trim();
  const company = (input.company ?? '').trim();
  const haystack = `${name} ${company} ${message}`.toLowerCase();

  // --- Behavioural signals -------------------------------------------------

  // Honeypot: hidden from real users, so any content is conclusive.
  if ((input.honeypot ?? '').trim().length > 0) {
    add(SPAM_THRESHOLD, 'honeypot field filled');
  }

  // Submitted faster than a human can type. Missing timestamps are ignored
  // rather than punished, so a cached page still works for real visitors.
  if (typeof input.renderedAt === 'number' && Number.isFinite(input.renderedAt)) {
    const elapsedSeconds = (Date.now() - input.renderedAt) / 1000;
    if (elapsedSeconds >= 0 && elapsedSeconds < MIN_FILL_SECONDS) {
      add(SPAM_THRESHOLD, `submitted in ${elapsedSeconds.toFixed(1)}s`);
    } else if (elapsedSeconds < 0 || elapsedSeconds > MAX_FORM_AGE_SECONDS) {
      add(2, 'form timestamp out of plausible range');
    }
  }

  // --- Name-field signals --------------------------------------------------
  // Real people type a name here. Bots reuse their email or URL payload.

  // Conclusive on its own: a real visitor never types an email into a name box,
  // and this is the dominant pattern in the spam actually being received.
  if (EMAIL_PATTERN.test(name)) {
    add(SPAM_THRESHOLD, 'email address in name field');
  }

  // Counted rather than .test()ed: URL_PATTERN is global, and .test() on a
  // global regex advances lastIndex between calls. String.match resets it.
  if (countMatches(name, URL_PATTERN) > 0) {
    add(5, 'URL in name field');
  }

  if (looksLikeGibberish(name)) {
    add(3, 'name looks like gibberish');
  }

  if (name.length > 4 && name === name.toUpperCase() && /[A-Z]{5,}/.test(name)) {
    add(1, 'name is all caps');
  }

  // --- Link signals --------------------------------------------------------

  const urlCount = countMatches(message, URL_PATTERN);
  if (urlCount >= 3) {
    add(5, `${urlCount} URLs in message`);
  } else if (urlCount === 2) {
    add(3, '2 URLs in message');
  } else if (urlCount === 1) {
    add(1, '1 URL in message');
  }

  if (BBCODE_PATTERN.test(message)) {
    add(5, 'BBCode link markup in message');
  }

  if (MARKDOWN_LINK_PATTERN.test(message)) {
    add(3, 'markdown link markup in message');
  }

  // --- Content signals -----------------------------------------------------

  const matchedPhrases = SPAM_PHRASES.filter((phrase) => haystack.includes(phrase));
  if (matchedPhrases.length > 0) {
    add(Math.min(matchedPhrases.length * 2, 6), `spam phrases: ${matchedPhrases.join(', ')}`);
  }

  if (looksLikeGibberish(message.replace(/\s/g, '').slice(0, 200))) {
    add(3, 'message looks like gibberish');
  }

  // Deliberately weak and below the threshold on its own: a genuine prospect
  // may write in another script, so this only matters alongside other signals.
  if (nonLatinRatio(message) > 0.3) {
    add(3, 'message is largely non-Latin script');
  }

  // The Latin-letter guard matters: caseless scripts equal their own
  // uppercase, so without it every Chinese message would score as shouting.
  if (
    message.length >= 20 &&
    /[A-Z]{5,}/.test(message) &&
    message === message.toUpperCase()
  ) {
    add(2, 'message is all caps');
  }

  // Bots frequently paste the same payload into every field.
  if (name.length >= 10 && name.toLowerCase() === message.toLowerCase()) {
    add(3, 'name and message are identical');
  }

  return { isSpam: score >= SPAM_THRESHOLD, score, reasons };
}
