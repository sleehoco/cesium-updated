'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

/**
 * Global providers for the application
 * This component wraps the entire app with necessary context providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create React Query client with optimized defaults
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Retry failed queries once
            retry: 1,
            // Don't refetch on window focus in production
            refetchOnWindowFocus: process.env['NODE_ENV'] === 'development',
            // Cache data for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
          },
          mutations: {
            // Don't retry mutations by default
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
