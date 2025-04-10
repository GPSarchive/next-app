import { getFirebaseAdminAuth } from '@/app/lib/firebaseAdmin';
import { NextRequest } from 'next/server';

const COOKIE_NAME = '__session'; // You can make this dynamic from env if preferred

// POST: Set session cookie
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const adminAuth = getFirebaseAdminAuth();
    if (!adminAuth) {
      return new Response(JSON.stringify({ error: 'Firebase Admin not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const expiresIn = 60 * 60 * 1000; // 1 hour
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });

    return new Response(JSON.stringify({ status: 'authenticated' }), {
      status: 200,
      headers: {
        'Set-Cookie': `${COOKIE_NAME}=${sessionCookie}; Max-Age=${expiresIn / 1000
          }; Path=/; HttpOnly; Secure; SameSite=Lax`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Session creation failed:', err);
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE: Clear session cookie
export async function DELETE() {
  return new Response(JSON.stringify({ status: 'logged_out' }), {
    status: 200,
    headers: {
      'Set-Cookie': `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`,
      'Content-Type': 'application/json',
    },
  });
}
