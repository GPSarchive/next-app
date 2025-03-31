// src/types/House.ts

export interface HouseImage {
    src: string;
    alt?: string;
  }
  
  export interface House {
    id: string; // required for hover & motion key
    firestoreId: string; // required for link generation
    title: string;
    price: string;
    images: HouseImage[];
    location?: {
      latitude: number;
      longitude: number;
    };
    [key: string]: any;
  }
  