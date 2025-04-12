// app/lib/houseService.ts
import { getFirebaseAdminDB, getFirebaseAdminAuth } from "@/app/lib/firebaseAdmin";

export async function getHousesData(sessionCookie: string | undefined) {
  // If sessionCookie is missing, you might want to throw an error or redirect.
  if (!sessionCookie) {
    throw new Error("Session cookie is missing.");
  }
  
  // Verify the session cookie.
  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    throw new Error("Firebase Admin not available.");
  }
  
  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
  const userTier = decodedClaims.tier || decodedClaims.role;
  if (userTier !== "admin" && userTier !== "premium") {
    throw new Error("Insufficient privileges.");
  }
  
  // Query the Firestore houses collection.
  const db = getFirebaseAdminDB();
  if (!db) {
    throw new Error("Firestore not available.");
  }
  
  const snapshot = await db.collection("houses").get();
  const houses = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  
  return houses;
}
