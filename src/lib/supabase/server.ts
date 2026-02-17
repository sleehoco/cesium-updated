import { createClient } from '@supabase/supabase-js';

let serverClient: ReturnType<typeof createClient> | null = null;

export function createServerSupabaseClient() {
  if (serverClient) return serverClient;

  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !key) {
    throw new Error('Missing Supabase server environment variables');
  }

  serverClient = createClient(url, key, {
    auth: { persistSession: false },
  });

  return serverClient;
}
