import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/register';

  if (!code) {
    return NextResponse.redirect(`${origin}/register?error=auth-callback-failed`);
  }

  // Forward the code to the client-side confirm page which handles the
  // PKCE exchange using the browser Supabase client (where the verifier lives)
  const confirmUrl = new URL(`${origin}/auth/confirm`);
  confirmUrl.searchParams.set('code', code);
  confirmUrl.searchParams.set('next', next);

  return NextResponse.redirect(confirmUrl.toString());
}
