'use client';

import { House } from '@/app/types/house';
import MapWrapper from '@/app/components/MapWrapper';

interface ClientMapWrapperProps {
  houses: House[];
}

export default function ClientMapWrapper({ houses }: ClientMapWrapperProps) {
  return <MapWrapper houses={houses} />;
}