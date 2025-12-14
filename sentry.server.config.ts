import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env['SENTRY_DSN'],

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production to reduce costs
  tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.1 : 1.0,

  // Capture errors and performance in development
  debug: process.env['NODE_ENV'] === 'development',

  // Environment information
  environment: process.env['NODE_ENV'] || 'development',

  // Release tracking (optional - useful for tracking which deployment has which errors)
  release: process.env['NEXT_PUBLIC_APP_VERSION'],

  // Filter out sensitive data
  beforeSend(event, _hint) {
    // Don't send events if no DSN is configured
    if (!process.env['SENTRY_DSN']) {
      return null;
    }

    // Filter out API keys and tokens from breadcrumbs and context
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.data) {
          const sanitized: Record<string, unknown> = { ...breadcrumb.data };
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
          breadcrumb.data = sanitized;
        }
        return breadcrumb;
      });
    }

    return event;
  },

  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random network errors
    'NetworkError',
    'Network request failed',
    // Timeout errors (we'll handle these separately)
    'AbortError',
  ],
});
