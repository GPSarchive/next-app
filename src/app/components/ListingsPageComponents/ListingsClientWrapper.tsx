'use client';

import dynamic from 'next/dynamic';
import { House } from '@/app/types/house';

const ListingsContent = dynamic(
  () => import('@/app/components/ListingsPageComponents/ListingsContent'),
  { ssr: false }
);

type Props = {
  initialHouses: House[];
};

export default function ListingsClientWrapper({ initialHouses }: Props) {
  return <ListingsContent initialHouses={initialHouses} />;
}