'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions, auth } from '@/app/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import HouseGridWrapper from '@/app/components/ListingsPageComponents/HouseGridWrapper';
import ClientMapWrapper from '@/app/components/ListingsPageComponents/ClientMapWrapper';
import FiltersWrapper from '@/app/components/ListingsPageComponents/FiltersWrapper';
import styles from '@/app/components/ListingsPageComponents/HousesMapPage.module.css';
import { House } from '@/app/types/house';

type Props = {
  initialHouses: House[];
};

export default function ListingsContent({ initialHouses }: Props) {
  const [houses, setHouses] = useState<House[]>(initialHouses);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setLoading(true);
      try {
        const getHousesFunc = httpsCallable(functions, 'getHouses');
        const result = await getHousesFunc();
        const additionalHouses = (result.data as House[]).map((house) => ({
          ...house,
          isAdditional: true,
          location: {
            ...house.location,
            longitude: Number(house.location.longitude),
          },
        }));

        setHouses((prev) => [...prev, ...additionalHouses]);
      } catch (err: any) {
        console.error('Error fetching user-specific houses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading && houses.length === 0) return <div>Loading...</div>;
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
