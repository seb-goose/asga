import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase sends users here after they confirm their email or click a
// password-reset link, with a `code` query param to exchange for a session.
// Password reset needs an active session so the update-password page can
// call auth.updateUser() - sign-up confirmation doesn't, and shouldn't
// silently log the person in; they land on a "verified" page and sign in
// explicitly from there.
const FLOWS_THAT_KEEP_SESSION = ["/en/update-password"];

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/en/login";

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
      if (!FLOWS_THAT_KEEP_SESSION.includes(next)) {
        await supabase.auth.signOut();
      }
      return NextResponse.redirect(`${publicOrigin}${next}`);
    }
  }

  return NextResponse.redirect(`${publicOrigin}/en/login?error=auth-callback-failed`);
}
