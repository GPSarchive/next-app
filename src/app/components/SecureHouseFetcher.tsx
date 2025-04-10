// components/SecureHouseFetcher.tsx
'use client';

import { useEffect, useState } from 'react';
import { initializeAppCheck, getToken, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from '@/app/firebase/firebaseConfig';
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

export default function SecureHouseFetcher() {
  const [houses, setHouses] = useState<House[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchHouses() {
      console.log('[SecureHouseFetcher] Starting fetch...');

      try {
        const appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_KEY!),
          isTokenAutoRefreshEnabled: true,
        });

        const tokenResult = await getToken(appCheck, false);
        const appCheckToken = tokenResult.token;
        console.log('[SecureHouseFetcher] Got App Check token:', appCheckToken.slice(0, 10), '...');

        const res = await fetch(
          'https://us-central1-real-estate-5ca52.cloudfunctions.net/getHouses',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'X-Firebase-AppCheck': appCheckToken,
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error('[SecureHouseFetcher] Server error response:', errorText);
          throw new Error(`Server error: ${errorText}`);
        }

        const data = await res.json();
        console.log('[SecureHouseFetcher] Fetched data:', data);

        setHouses(data.houses);
      } catch (err: any) {
        console.error('[SecureHouseFetcher] Error caught:', err.message);
        setError(err.message);
      }
    }

    fetchHouses();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log('[SecureHouseFetcher] Rendering with houses:', houses.length);
  return <HouseGridWrapper houses={houses} />;
}
