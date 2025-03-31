// lib/cookies.ts
import { cookies } from 'next/headers';
import { getFirebaseAdmin } from './firebaseAdmin'
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const COOKIE_NAME = process.env.COOKIE_NAME || '__session';
const secret = new TextEncoder().encode(process.env.COOKIE_SECRET);

// ✅ Create cookie-safe JWT
export async function createSessionCookie(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

// ✅ Read + verify session from cookie
export async function getUserFromCookie() {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
  
    const admin = getFirebaseAdmin();
    if (!admin) return null;
  
    try {
      const decoded = await admin.auth.verifySessionCookie(token, true);
      return decoded;
    } catch (err) {
      console.error('❌ Invalid session cookie:', err);
      return null;
    }
  }
  
// ✅ Clear the cookie
export async function clearSessionCookie() {
  (await cookies()).delete(COOKIE_NAME);
}
