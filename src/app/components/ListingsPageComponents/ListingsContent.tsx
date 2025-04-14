'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/firebase/firebaseConfig';
import HouseGridWrapper from '@/app/components/ListingsPageComponents/HouseGridWrapper';
import ClientMapWrapper from '@/app/components/ListingsPageComponents/ClientMapWrapper';
import FiltersWrapper from '@/app/components/ListingsPageComponents/FiltersWrapper';
import styles from '@/app/components/ListingsPageComponents/HousesMapPage.module.css';
import { House } from '@/app/types/house';

export default function ListingsContent() {
  const [houses, setHouses] = useState<House[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHouses() {
      try {
        const getHouses = httpsCallable(functions, 'getHouses');
        const result = await getHouses();
        const data = result.data as { houses: House[] };
        setHouses(data.houses);
      } catch (err: any) {
        console.error('Error fetching houses:', err);
        setError(err.message || 'An error occurred');
      }
    }
    fetchHouses();
  }, []);

  if (error) return <div>Error: {error}</div>;

  // Separate houses into public and private
  const publicHouses = houses.filter(h => h.isPublic);
  const privateHouses = houses.filter(h => !h.isPublic);

  return (
    <div className={styles.content}>
      <div className={styles.leftPanel}>
        
        <div>
          <h2>Public Listings</h2>
          <HouseGridWrapper houses={publicHouses} />
        </div>
        {privateHouses.length > 0 && (
          <div>
            <h2>Private Listings</h2>
            <HouseGridWrapper houses={privateHouses} />
          </div>
        )}
      </div>
      <div className={styles.rightPanel}>
        <ClientMapWrapper houses={houses} />
      </div>
    </div>
  );
}