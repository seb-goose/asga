import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { initializePersonalize } from './lib/cspersonalize';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es', 'fr', 'de'],

  // Used when no locale matches
  defaultLocale: 'en',
  //localeDetection: false
});

// Copies the refreshed Supabase auth cookies onto whichever response the
// rest of the middleware chain ends up producing.
function withSupabaseCookies(response: NextResponse, supabaseResponse: NextResponse) {
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/auth')) {
    return await updateSession(req);
  }

  const supabaseResponse = await updateSession(req);

  if (!process.env.HOSTING || (process.env.HOSTING && process.env.HOSTING !== 'launch')) {
    const projectUid = process.env.CONTENTSTACK_PERSONALIZATION as string;

    const { variantParam, personalize } = await initializePersonalize(req, process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL, projectUid);

    // For non-API routes, we must rewrite the URL to support next-intl
    if (!req.nextUrl.pathname.startsWith('/api')) {
      const parsedUrl = new URL(req.url);
      // parsedUrl.searchParams.set(personalize.VARIANT_QUERY_PARAM, variantParam);
      const newReq = new NextRequest(parsedUrl.toString(), req);
      newReq.headers.set('x-personalize-variants', variantParam || '');
      const response = intlMiddleware(newReq);
      personalize?.addStateToResponse(response);
      return withSupabaseCookies(response, supabaseResponse);
    }


    // For API routes, it's more reliable to pass the variants via headers.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-personalize-variants', variantParam || '');

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });


    // add cookies to the response
    personalize?.addStateToResponse(response);


    return withSupabaseCookies(response, supabaseResponse);

  }

  if (req.nextUrl.pathname.startsWith('/api')) {
    return withSupabaseCookies(NextResponse.next(), supabaseResponse);
  }

  return withSupabaseCookies(intlMiddleware(req), supabaseResponse);
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ]
};