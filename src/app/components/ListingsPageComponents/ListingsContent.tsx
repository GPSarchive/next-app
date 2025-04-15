'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions, auth, db } from '@/app/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import HouseGridWrapper from '@/app/components/ListingsPageComponents/HouseGridWrapper';
import ClientMapWrapper from '@/app/components/ListingsPageComponents/ClientMapWrapper';
import FiltersWrapper from '@/app/components/ListingsPageComponents/FiltersWrapper';
import styles from '@/app/components/ListingsPageComponents/HousesMapPage.module.css';
import { House } from '@/app/types/house';

export default function ListingsContent() {
  const [houses, setHouses] = useState<House[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        // Fetch public houses
        const publicQuery = query(collection(db, "houses"), where("isPublic", "==", true));
        const publicSnapshot = await getDocs(publicQuery);
        const publicHouses = publicSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          location: {
            ...doc.data().location,
            longitude: Number(doc.data().location.longitude),
          },
        } as House));

        if (!user) {
          // Non-authenticated: only public houses
          setHouses(publicHouses);
        } else {
          // Authenticated: fetch additional houses via getHouses
          const getHousesFunc = httpsCallable(functions, 'getHouses');
          const result = await getHousesFunc();
          const additionalHouses = (result.data as House[]).map(house => ({
            ...house,
            location: {
              ...house.location,
              longitude: Number(house.location.longitude),
            },
          }));
          setHouses([...publicHouses, ...additionalHouses]);
        }
      } catch (err: any) {
        console.error('Error fetching houses:', err);
        setError(err.message || 'An error occurred while fetching houses');
        setHouses([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (houses.length === 0) return <div>No houses found.</div>;

  return (
    <div className={styles.content}>
      <div className={styles.leftPanel}>
        <FiltersWrapper resultsCount={houses.length} />
        <HouseGridWrapper houses={houses} />
      </div>
      <div className={styles.rightPanel}>
        <ClientMapWrapper houses={houses} />
      </div>
    </div>
  );
}