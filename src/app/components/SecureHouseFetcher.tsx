'use client';
import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/firebase/firebaseConfig";
import HouseGridWrapper from "@/app/components/HouseGridWrapper";

// Define your House type as before.
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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchHouses() {
      try {
        const getHouses = httpsCallable(functions, "getHouses");
        const result = await getHouses();
        const data = result.data as { houses: House[] };
        setHouses(data.houses);
      } catch (err: any) {
        console.error("Error fetching houses:", err);
        setError(err.message || "An error occurred");
      }
    }
    fetchHouses();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return <HouseGridWrapper houses={houses} />;
}