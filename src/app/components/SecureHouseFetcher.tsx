'use client';

import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/firebase/firebaseConfig";
import HouseGridWrapper from "@/app/components/HouseGridWrapper";



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
        // When replay protection is enabled, request limited-use tokens:
        const getHousesCallable = httpsCallable(functions, "getHouses", {
          // For limited-use tokens (required if consumeAppCheckToken is true)
          limitedUseAppCheckTokens: true,
        });

        const result = await getHousesCallable({});
        // The function returns { houses: House[] }
        const data = result.data as { houses: House[] };
        setHouses(data.houses);
      } catch (err: any) {
        console.error("Error fetching houses:", err);
        setError(err.message || "Error fetching houses.");
      }
    }

    fetchHouses();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return <HouseGridWrapper houses={houses} />;
}
