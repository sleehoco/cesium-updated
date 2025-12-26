import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * OAuth callback handler
 * This route handles the callback from OAuth providers like Google
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  // SECURITY: Validate redirect origin to prevent open redirects
  const allowedOrigins = [
    process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000',
    'https://cesiumcybersoft.com',
    'https://www.cesiumcybersoft.com',
  ].filter(Boolean);

  if (!allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: 'Invalid origin' },
      { status: 400 }
    );
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard after successful auth
  return NextResponse.redirect(`${origin}/dashboard`);
}
