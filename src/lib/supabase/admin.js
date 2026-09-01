import { createClient } from "@supabase/supabase-js";

// Secret-key client for server-only use (API routes). Bypasses Row Level
// Security, so it can write a member's profile row immediately after
// sign-up, before their email is confirmed and before they have a session.
// Never import this from a Client Component or expose the key to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
