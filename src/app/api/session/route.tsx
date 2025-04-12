// src/app/api/session/route.tsx

import { getFirebaseAdminAuth } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = process.env.COOKIE_NAME || '__session';
// Set a common parent domain if available—for example, '.example.com'.
// You can configure this via an environment variable.
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

export async function POST(req: Request) {
  const { token } = await req.json();

  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    return NextResponse.json(
      { error: 'Firebase Admin not available' },
      { status: 500 }
    );
  }

  try {
    // Create session cookie with 1 hour expiration (in milliseconds)
    const expiresIn = 60 * 60 * 1000; // 3,600,000 ms
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });

    // When setting the cookie, include the domain attribute if provided.
    await (await cookies()).set({
      name: COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      // If COOKIE_DOMAIN is defined, it will be used.
      // For example, if your website is hosted on 'app.example.com'
      // and you want the cookie to be available on all subdomains,
      // set COOKIE_DOMAIN to ".example.com".
      ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
      maxAge: expiresIn / 1000, // convert milliseconds to seconds
      sameSite: 'lax',
    });

    return NextResponse.json({ status: 'authenticated' });
  } catch (err) {
    console.error('Session creation failed:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function DELETE() {
  await (await cookies()).delete(COOKIE_NAME);
  return NextResponse.json({ status: 'logged_out' });
}
