'use client';

import dynamic from 'next/dynamic';

const ListingsContent = dynamic(
  () => import('@/app/components/ListingsPageComponents/ListingsContent'),
  { ssr: false }
);

export default function ListingsClientWrapper() {
  return <ListingsContent />;
}
