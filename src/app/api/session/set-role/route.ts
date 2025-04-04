// src/app/api/set-role/route.ts
import { cookies } from 'next/headers';
import { getFirebaseAdminAuth } from '@/app/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = process.env.COOKIE_NAME || '__session';

export async function POST(req: NextRequest) {
  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 500 });
  }

  // Get the session cookie from the request
  const sessionCookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the caller's session and check their role
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const callerRole = decoded.role;

    if (callerRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Only admins can set roles' }, { status: 403 });
    }

    // Get the target user's UID and desired role from the request body
    const { uid, role } = await req.json();
    if (!uid || !role || !['premium', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Set the custom claim for the target user
    await adminAuth.setCustomUserClaims(uid, { role });
    console.log(`Role set to ${role} for user ${uid}`);

    return NextResponse.json({ message: `Role set to ${role} for user ${uid}` });
  } catch (err) {
    console.error('Error setting role:', err);
    return NextResponse.json({ error: 'Invalid session or internal error' }, { status: 401 });
  }
}