import { getFirebaseAdmin } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = process.env.COOKIE_NAME || '__session';

export async function POST(req: Request) {
  const { token } = await req.json();

  const admin = getFirebaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Firebase Admin not available' },
      { status: 500 }
    );
  }

  try {
    // Create session cookie with 1 hour expiration
    const expiresIn = 60 * 60 * 1000; // 3,600,000 milliseconds

    const sessionCookie = await admin.auth.createSessionCookie(token, { expiresIn });

        (await cookies()).set({
          name: COOKIE_NAME,
          value: sessionCookie,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: expiresIn / 1000, // convert back to seconds for cookie settings if needed
        });


    return NextResponse.json({ status: 'authenticated' });
  } catch (err) {
    console.error('Session creation failed:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete(COOKIE_NAME);
  return NextResponse.json({ status: 'logged_out' });
}
