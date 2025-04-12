'use client';

import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/firebase/firebaseConfig";
import HouseGridWrapper from "@/app/components/HouseGridWrapper";
import { cookies } from "next/headers";



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

export default function SecureHouseFetcher() {
  const [houses, setHouses] = useState<House[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchHouses() {
      try {
        const getHousesCallable = httpsCallable(functions, "getHouses");
        // Assuming you have a function to read the session cookie (if not HTTP-only)
        const sessionCookie = (await cookies()).get('__session')?.value;
        const result = await getHousesCallable({ sessionCookie });
        const data = result.data as { houses: House[] };
        setHouses(data.houses);
      } catch (err: unknown) {
        let errMsg: string;
        if (err instanceof Error) {
          errMsg = err.message;
        } else {
          errMsg = "Unknown error";
        }
        console.error("Error fetching houses:", errMsg);
        setError(errMsg);
      }
    }
    fetchHouses();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return <HouseGridWrapper houses={houses} />;
}