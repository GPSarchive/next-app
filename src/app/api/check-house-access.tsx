import { getFirebaseAdminAuth, getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { sessionCookie, houseId } = await req.json();

  if (!houseId) {
    return NextResponse.json({ status: 'invalid-argument', message: 'House ID is required' }, { status: 400 });
  }

  const adminAuth = getFirebaseAdminAuth();
  const adminDb = getFirebaseAdminDB();

  if (!adminAuth || !adminDb) {
    console.error('Firebase Admin SDK not initialized');
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
  }

  try {
    // Fetch the house document
    const houseDoc = await adminDb.collection('houses').doc(houseId).get();
    if (!houseDoc.exists) {
      return NextResponse.json({ status: 'not_found' });
    }
    const houseData = houseDoc.data();

    if (houseData?.isPublic) {
      return NextResponse.json({ status: 'allowed' });
    }

    // House is private, check user access
    if (!sessionCookie) {
      return NextResponse.json({ status: 'unauthenticated' });
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;
    const role = decodedClaims.role;

    if (role === 'admin') {
      return NextResponse.json({ status: 'allowed' });
    }

    // Check if uid is in allowedUsers
    if (houseData?.allowedUsers && houseData.allowedUsers.includes(uid)) {
      return NextResponse.json({ status: 'allowed' });
    }

    return NextResponse.json({ status: 'unauthorized' });
  } catch (error) {
    console.error('Error in check-house-access:', error);
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
  }
}