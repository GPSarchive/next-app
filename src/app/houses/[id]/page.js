// app/houses/[id]/page.js
import { notFound } from 'next/navigation';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import SessionAuthGuard from '@/app/lib/SessionAuthGuard';
import NavBar from '@/app/lib/NavBar';
import DetailsContent from '@/app/components/DetailsPageComponents/DetailsContent';

export const metadata = {
  title: 'Property Details',
};

export default async function PropertyPage({ params }) {
  const adminDb = getFirebaseAdminDB();
  if (!adminDb) {
    console.error('Firebase Admin Firestore not initialized');
    throw new Error('Internal server error');
  }

  try {
    const houseDoc = await adminDb.collection('houses').doc(params.id).get();
    if (!houseDoc.exists) {
      console.warn('House not found:', params.id);
      notFound();
    }

    const houseData = houseDoc.data();

    if (houseData.isPublic) {
      return (
        <>
          <NavBar />
          <DetailsContent property={houseData} />
        </>
      );
    } else {
      return (
        <SessionAuthGuard houseId={params.id}>
          <NavBar />
          <DetailsContent property={houseData} />
        </SessionAuthGuard>
      );
    }
  } catch (error) {
    console.error('Error fetching house data:', error);
    notFound();
  }
}