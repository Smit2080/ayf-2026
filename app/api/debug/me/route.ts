import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sbToken0 = request.cookies.get('sb-mdikvuejzuctrqzotkip-auth-token.0');
  const sbToken1 = request.cookies.get('sb-mdikvuejzuctrqzotkip-auth-token.1');

  let parsedToken: any = null;
  let accessToken: string | null = null;

  if (sbToken0) {
    try {
      // The cookie value is JSON: {"access_token":"...","refresh_token":"...","user":{...}}
      parsedToken = JSON.parse(sbToken0.value);
      accessToken = parsedToken.access_token;
    } catch (e) {
      // Maybe it's the newer format (just the token string)?
      accessToken = sbToken0.value;
    }
  }

  // Decode JWT payload (middle part)
  let jwtPayload: any = null;
  if (accessToken) {
    try {
      const parts = accessToken.split('.');
      jwtPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    } catch (e) {}
  }

  // Try with createServerClient using request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        },
      },
    }
  );

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();

  return NextResponse.json({
    hasToken0: !!sbToken0,
    hasToken1: !!sbToken1,
    rawToken0Preview: sbToken0 ? sbToken0.value.substring(0, 80) + '...' : null,
    decodedJwt: jwtPayload ? {
      sub: jwtPayload.sub,
      email: jwtPayload.email,
      exp: jwtPayload.exp ? new Date(jwtPayload.exp * 1000).toISOString() : null,
      iat: jwtPayload.iat ? new Date(jwtPayload.iat * 1000).toISOString() : null,
      aud: jwtPayload.aud,
    } : null,
    getUserError: authErr?.message || null,
    getSessionError: sessErr?.message || null,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
  });
}
