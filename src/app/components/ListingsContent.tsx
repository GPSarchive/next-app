'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/firebase/firebaseConfig';
import HouseGridWrapper from '@/app/components/HouseGridWrapper';
import ClientMapWrapper from '@/app/components/ClientMapWrapper';
import FiltersWrapper from '@/app/components/FiltersWrapper';
import styles from '@/app/components/HousesMapPage.module.css';

type House = {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  bedrooms: number;
  kitchens: string;
  floor: string;
  size: string;
  yearBuilt: string;
  windowType: string;
  energyClass: string;
  hasHeating: string;
  heatingType: string;
  parking: string;
  suitableFor: string;
  specialFeatures: string;
  location: {
    latitude: number;
    longitude: number;
  };
  images: {
    src: string;
    alt: string;
  }[];
};

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