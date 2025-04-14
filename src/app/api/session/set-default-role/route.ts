// src/app/api/set-default-role/route.ts
import { getFirebaseAdminAuth } from '@/app/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { uid } = await req.json();
  const adminAuth = getFirebaseAdminAuth();

  if (!adminAuth) {
    return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 500 });
  }

  // Use environment variable to determine the role, defaulting to 'public'
  const defaultRole = process.env.DEFAULT_ROLE || 'public';

  try {
    await adminAuth.setCustomUserClaims(uid, { role: defaultRole });
    return NextResponse.json({ message: `Default role set to ${defaultRole}` });
  } catch (err) {
    console.error('Error setting default role:', err);
    return NextResponse.json({ error: 'Failed to set default role' }, { status: 500 });
  }
}