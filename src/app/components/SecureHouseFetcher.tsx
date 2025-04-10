'use client';

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

export default function SecureHouseFetcher({ houses }: Props) {
  console.log('[SecureHouseFetcher] Rendering with houses:', houses.length);
  return <HouseGridWrapper houses={houses} />;
}
