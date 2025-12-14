import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env['SENTRY_DSN'],

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production
  tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.1 : 1.0,

  // Environment information
  environment: process.env['NODE_ENV'] || 'development',

  // Release tracking
  release: process.env['NEXT_PUBLIC_APP_VERSION'],

  // Filter out sensitive data
  beforeSend(event, _hint) {
    if (!process.env['SENTRY_DSN']) {
      return null;
    }
    return event;
  },
});
