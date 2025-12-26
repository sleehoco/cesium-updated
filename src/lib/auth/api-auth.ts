/**
 * API Authentication Helper
 * Reusable authentication middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export interface AuthResult {
  authorized: boolean;
  user: User | null;
  error?: NextResponse;
}

/**
 * Verify user authentication for API routes
 * 
 * @param _req - The Next.js request object (unused but kept for future middleware needs)
 * @returns AuthResult with user data or error response
 * 
 * @example
 * export async function POST(req: NextRequest) {
 *   const auth = await requireAuth(req);
 *   if (!auth.authorized) return auth.error!;
 *   
 *   // Use auth.user for authenticated requests
 *   const userId = auth.user.id;
 * }
 */
export async function requireAuth(_req: NextRequest): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return {
        authorized: false,
        user: null,
        error: NextResponse.json(
          { 
            success: false,
            error: 'Unauthorized. Please sign in to access this resource.' 
          },
          { status: 401 }
        ),
      };
    }
    
    return {
      authorized: true,
      user,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      authorized: false,
      user: null,
      error: NextResponse.json(
        { 
          success: false,
          error: 'Authentication service unavailable.' 
        },
        { status: 503 }
      ),
    };
  }
}

/**
 * Optional authentication - returns user if authenticated, but doesn't block
 * Useful for endpoints that have different behavior for authenticated users
 */
export async function optionalAuth(_req: NextRequest): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
