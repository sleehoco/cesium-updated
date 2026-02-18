import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const code = req.cookies.get('cesium_access')?.value;

    if (!code) {
      return NextResponse.json({ authenticated: false });
    }

    const supabase = createServerSupabaseClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('access_codes') as any)
      .select('id, expires_at')
      .eq('code', code)
      .single() as { data: { id: number; expires_at: string | null } | null; error: unknown };

    if (error || !data) {
      return NextResponse.json({ authenticated: false });
    }

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
