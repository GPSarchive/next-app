// app/listings/page.tsx

import NavBar from '@/app/lib/NavBar';
import ListingsClientWrapper from '@/app/components/ListingsPageComponents/ListingsClientWrapper';
import styles from '@/app/components/ListingsPageComponents/HousesMapPage.module.css';
import { db } from '@/app/firebase/firebaseServer'; // 🔥 server-side firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { House } from '@/app/types/house';

export const runtime = 'nodejs';

export default async function SecureListingsPage() {
  const publicQuery = query(
    collection(db, 'houses'),
    where('isPublic', '==', true)
  );
  const publicSnapshot = await getDocs(publicQuery);
  const publicHouses: House[] = publicSnapshot.docs.map(doc => {
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
