import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production to reduce costs
  tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.1 : 1.0,

  // Session replay sampling
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Environment information
  environment: process.env['NODE_ENV'] || 'development',

  // Release tracking
  release: process.env['NEXT_PUBLIC_APP_VERSION'],

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out sensitive data
  beforeSend(event, _hint) {
    // Don't send events if no DSN is configured
    if (!process.env['NEXT_PUBLIC_SENTRY_DSN']) {
      return null;
    }

    // Filter out API keys from request data
    if (event.request && event.request.data) {
      const sanitized: Record<string, unknown> = { ...event.request.data };
      Object.keys(sanitized).forEach(key => {
        if (
          key.toLowerCase().includes('api') ||
          key.toLowerCase().includes('key') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('secret')
        ) {
          sanitized[key] = '[REDACTED]';
        }
      });
      event.request.data = sanitized;
    }

    return event;
  },

  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'Non-Error promise rejection captured',
    // Network errors
    'NetworkError',
    'Network request failed',
    'Failed to fetch',
    // Aborted requests
    'AbortError',
    'The user aborted a request',
  ],
});
