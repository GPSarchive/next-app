'use client';

import React from 'react';
import HouseGrid from '@/app/components/ListingsPageComponents/HouseGrid';
import { House } from '@/app/types/house';

type Props = {
  houses: House[];
  /**
   * Called when a house card is hovered over or hovered out.
   * Pass null on hover out to close the popup.
   */
  onHover: (house: House | null) => void;
};

export default function HouseGridWrapper({ houses, onHover }: Props) {
  const handleHover = (house: House) => {
    onHover(house);
  };
  const handleLeave = () => {
    onHover(null);
  };

  return (
    <div onMouseLeave={handleLeave}>
      <HouseGrid
        houses={houses.map((h) => ({ ...h, firestoreId: h.id }))}
        onHover={handleHover}
      />
    </div>
  );
}
