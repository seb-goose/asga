import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase sends users here after they confirm their email or click a
// password-reset link, with a `code` query param to exchange for a session.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/en/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/en/login?error=auth-callback-failed`);
}
