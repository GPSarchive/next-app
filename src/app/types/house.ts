export type House = {
    id: string;
    title: string;
    price: string;
    description?: string;
    images: { src: string; alt?: string }[];
    location?: {
      latitude: number;
      longitude: number;
    };
    latitude?: number;
    longitude?: number;
    category?: string;
    size?: string;
    bedrooms?: number;
    parking?: string;
    floor?: string;
    energyClass?: string;
    yearBuilt?: string;
    kitchens?: string;
    heatingType?: string;
    specialFeatures?: string;
    windowType?: string;
    hasHeating?: string;
    suitableFor?: string;
    [key: string]: any;
  };