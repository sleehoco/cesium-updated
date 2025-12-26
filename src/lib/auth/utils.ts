import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

/**
 * Authentication utility functions
 */

/**
 * Get the current authenticated user (server-side)
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in server components that require authentication
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Get user session (server-side)
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Require authentication for API routes
 * Returns user if authenticated, null if not
 * Use this in API route handlers to enforce authentication
 */
export async function requireAuthAPI(): Promise<{ user: User } | { error: string; status: number }> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: 'Authentication required. Please sign in to use this tool.',
      status: 401,
    };
  }

  return { user };
}
