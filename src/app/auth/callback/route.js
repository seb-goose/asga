import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase sends users here after they confirm their email or click a
// password-reset link, with a `code` query param to exchange for a session.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/en/account";

  // Behind a reverse proxy (Contentstack Launch, Vercel, etc.) `origin`
  // reflects the app's internal address, not the public domain - prefer
  // the forwarded host the proxy actually received the request on.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const publicOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${publicOrigin}${next}`);
    }
  }

  return NextResponse.redirect(`${publicOrigin}/en/login?error=auth-callback-failed`);
}
