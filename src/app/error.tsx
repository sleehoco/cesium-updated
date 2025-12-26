'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

/**
 * Global error boundary
 * Catches errors in the app and displays a fallback UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for development
    console.error('Application error:', error);

    // Send to Sentry error tracking
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'global',
      },
      contexts: {
        errorInfo: {
          digest: error.digest,
          message: error.message,
          name: error.name,
        },
      },
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. This has been logged and we&apos;ll look into it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error.message && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground font-mono">{error.message}</p>
            </div>
          )}
          {error.digest && (
            <p className="mt-2 text-xs text-muted-foreground">Error ID: {error.digest}</p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} className="flex-1">
            Try again
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => (window.location.href = '/')}>
            Go home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
