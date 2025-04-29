'use client';

import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions, auth } from '@/app/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import HouseGridWrapper from '@/app/components/ListingsPageComponents/HouseGridWrapper';
import ClientMapWrapper from '@/app/components/ListingsPageComponents/ClientMapWrapper';
import { House } from '@/app/types/house';

type Props = {
  initialHouses: House[];
};

export default function ListingsContent({ initialHouses }: Props) {
  const [houses, setHouses] = useState<House[]>(initialHouses);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState<{
    latitude: number;
    longitude: number;
    zoom: number;
  }>(() => {
    if (initialHouses.length) {
      const h = initialHouses[0];
      return {
        latitude: Number(h.location.latitude),
        longitude: Number(h.location.longitude),
        zoom: 12,
      };
    }
    return { latitude: 0, longitude: 0, zoom: 2 };
  });
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

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
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-[0.95] overflow-y-scroll scrollbar-hide p-5 bg-[#D6D2C4] relative shadow-[10px_0px_20px_rgba(0,0,0,0.15)] z-20">
        <HouseGridWrapper
          houses={houses}
          onHover={(house) => {
            setSelectedHouse(house);
            if (house) {
              setViewState({
                latitude: Number(house.location.latitude),
                longitude: Number(house.location.longitude),
                zoom: 15,
              });
            }
          }}
        />
        {/* Gradient overlay for softer transition */}
        <div className="pointer-events-none absolute top-0 -right-2 w-5 h-full bg-gradient-to-l from-[rgba(0,0,0,0.15)] to-transparent" />
      </div>
      <div className="flex-1 h-full relative z-10">
        <ClientMapWrapper
          houses={houses}
          viewState={viewState}
          selectedHouse={selectedHouse}
          setViewState={setViewState}
          setSelectedHouse={setSelectedHouse}
        />
      </div>
    </div>
  );
}
