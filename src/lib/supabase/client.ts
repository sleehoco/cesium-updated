import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

let browserClient: ReturnType<typeof supabaseCreateClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const key = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  if (!url || !key) {
    throw new Error('Missing Supabase client environment variables');
  }

  browserClient = supabaseCreateClient(url, key);
  return browserClient;
}

// Alias used by auth pages
export function createClient() {
  return getSupabaseBrowserClient();
}
