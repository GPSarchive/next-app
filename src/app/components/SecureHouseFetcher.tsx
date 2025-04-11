'use client';
import { useEffect, useState } from 'react';
import HouseGridWrapper from '@/app/components/HouseGridWrapper';

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

type Props = {
  houses: House[];
};

export default function SecureHouseFetcher({ appCheckToken }: { appCheckToken: string }) {
  const [houses, setHouses] = useState<House[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://us-central1-your-project.cloudfunctions.net/getHouses', {
          method: 'GET',
          headers: {
            'X-Firebase-AppCheck': appCheckToken,
          },
          credentials: 'include', // Required to send cookies
        });

        if (!res.ok) {
          throw new Error(`Server error: ${await res.text()}`);
        }

        const data = await res.json();
        setHouses(data.houses);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchData();
  }, [appCheckToken]);

  if (error) return <div>Error: {error}</div>;

  return <HouseGridWrapper houses={houses} />;
}

