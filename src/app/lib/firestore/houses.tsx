import { getFirebaseAdminDB } from "@/app/lib/firebaseAdmin";
import type { House } from "@/app/types/house";

export async function getAllHouses(): Promise<House[]> {
  const db = getFirebaseAdminDB();
  if (!db) throw new Error("Firebase Admin DB not initialized");

  const snapshot = await db.collection("houses").get();
  const houses: House[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as House[];

  return houses;
}