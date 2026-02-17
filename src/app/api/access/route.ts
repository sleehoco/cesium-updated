import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const accessSchema = z.object({
  code: z.string().min(1, 'Access code is required').max(100),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`access:${ip}`, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code } = accessSchema.parse(body);

    const supabase = createServerSupabaseClient();

    // Look up the access code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('access_codes') as any)
      .select('id, code, max_uses, used_count, expires_at')
      .eq('code', code)
      .single() as { data: { id: number; code: string; max_uses: number | null; used_count: number; expires_at: string | null } | null; error: unknown };

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Invalid access code' },
        { status: 401 }
      );
    }

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Invalid access code' },
        { status: 401 }
      );
    }

    // Check usage limit
    if (data.max_uses !== null && data.used_count >= data.max_uses) {
      return NextResponse.json(
        { success: false, error: 'Invalid access code' },
        { status: 401 }
      );
    }

    // Increment used_count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('access_codes') as any)
      .update({ used_count: data.used_count + 1 })
      .eq('id', data.id);

    // Set HTTP-only cookie (30 days)
    const response = NextResponse.json({ success: true });
    response.cookies.set('cesium_access', code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid access code' },
        { status: 400 }
      );
    }

    console.error('Access code error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
