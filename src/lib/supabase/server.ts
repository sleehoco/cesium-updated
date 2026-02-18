import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

let serverClient: ReturnType<typeof supabaseCreateClient> | null = null;

export function createServerSupabaseClient() {
  if (serverClient) return serverClient;

  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !key) {
    throw new Error('Missing Supabase server environment variables');
  }

  serverClient = supabaseCreateClient(url, key, {
    auth: { persistSession: false },
  });

  return serverClient;
}

// Alias used by auth callback routes
export async function createClient() {
  return createServerSupabaseClient();
}
