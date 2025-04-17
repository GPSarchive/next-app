// app/listings/page.tsx

import NavBar from '@/app/lib/NavBar';
import ListingsClientWrapper from '@/app/components/ListingsPageComponents/ListingsClientWrapper';
import styles from '@/app/components/ListingsPageComponents/HousesMapPage.module.css';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { House } from '@/app/types/house';

export const runtime = 'nodejs';

export default async function SecureListingsPage() {
  const db = getFirebaseAdminDB();

  if (!db) {
    throw new Error('❌ Firebase Admin DB not initialized.');
  }

  const snapshot = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .get();

  const publicHouses: House[] = snapshot.docs.map((doc) => {
    const data = doc.data() as House;
    return {
      ...data,
      id: doc.id,
      location: {
        ...data.location,
        longitude: Number(data.location.longitude),
      },
      isAdditional: false,
    };
  });

  return (
    <div className={styles.container}>
      <NavBar />
      <ListingsClientWrapper initialHouses={publicHouses} />
    </div>
  );
}

