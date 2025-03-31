import { getFirebaseAdmin } from '@/app/lib/firebaseAdmin';
import type { House } from '@/app/types/house';

export async function getAllHouses(): Promise<House[]> {
  const admin = getFirebaseAdmin();
  if (!admin) throw new Error('Firebase Admin not initialized');

  const snapshot = await admin.db.collection('houses').get();
  const houses: House[] = [];

  snapshot.forEach((doc) => {
    houses.push({ id: doc.id, ...doc.data() } as House);
  });

  return houses;
}
