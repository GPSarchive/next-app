// src/app/houses/[id]/page.js
import { notFound } from 'next/navigation';
import NavBar from '@/app/lib/NavBar';
import SessionAuthGuard from '@/app/lib/SessionAuthGuard';
import DetailsContent from '@/app/components/DetailsContent';

export const metadata = {
  title: 'Property Details',
};

export default async function PropertyPage({ params }) {
  const { id } = params;
  console.log('🔎 Fetching house with ID:', id);

  let property;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/houses/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('❌ House not found:', id);
        notFound();
      }
      throw new Error('Failed to fetch house data');
    }

    property = await response.json();
  } catch (err) {
    console.error('🔥 Error fetching house data:', err);
    notFound();
  }

  return (
    <SessionAuthGuard>
      <NavBar />
      <DetailsContent property={property} />
    </SessionAuthGuard>
  );
}