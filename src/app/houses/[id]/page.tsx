// src/app/houses/[id]/page.tsx

import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getFirebaseAdmin } from '@/app/lib/firebaseAdmin';

import Gallery from '@/app/components/Gallery';
import PropertyDetails from '@/app/components/PropertyDetails';
import PropertyDescription from '@/app/components/PropertyDescription';
import NavBar from '@/app/components/NavBar';
import SmartMap from '@/app/components/SmartMap';
import styles from '@/app/components/PropertyPage.module.css';

import type { Metadata } from 'next';
import type { House } from '@/app/types/house';

type Props = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: 'Property Details',
};

export default async function PropertyPage({ params }: Props) {
  const { id } = params;
  const cookieStore = cookies();
  const token = (await cookieStore).get('__session')?.value;

  if (!token) {
    console.warn('❌ No session cookie found — redirecting');
    redirect('/login');
  }

  const firebase = getFirebaseAdmin();
  if (!firebase) {
    console.error('❌ Firebase Admin not initialized');
    redirect('/login');
  }

  const { auth, db } = firebase;

  try {
    const decoded = await auth.verifySessionCookie(token, true);
    console.log('✅ Authenticated user:', decoded.email);
  } catch (err) {
    console.error('❌ Invalid session cookie:', err);
    redirect('/login');
  }

  try {
    const docRef = db.collection('houses').doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      console.warn('❌ House not found:', id);
      notFound();
    }

    const property = { id: snapshot.id, ...snapshot.data() } as House;

    const latitude = property.latitude || property.location?.latitude;
    const longitude = property.longitude || property.location?.longitude;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      console.warn('❌ Invalid lat/lng for house');
      notFound();
    }

    const mapHouses = [
      {
        id: property.id,
        latitude,
        longitude,
        title: property.title,
        price: property.price,
        images: property.images || [],
      },
    ];

    return (
      <main className={styles.pageContainer}>
        <NavBar />

        <div className={`${styles.galleryWrapper} ${styles.fadeInLeft}`}>
          <Gallery
            images={property.images.map((image) => ({
              ...image,
              alt: image.alt || 'Default alt text',
            }))}
          />
        </div>

        <div className={styles.detailsMapContainer}>
          <div className={styles.detailsWrapper}>
            <PropertyDetails property={property} />
          </div>

          <div className={styles.mapWrapper}>
            <SmartMap
              houses={mapHouses}
              viewState={{ latitude, longitude, zoom: 12 }}
              selectedHouse={null}
            />
          </div>
        </div>

        <div className={styles.descriptionWrapper}>
          <PropertyDescription description={property.description} />
        </div>
      </main>
    );
  } catch (err) {
    console.error('🔥 Error loading house data:', err);
    notFound();
  }
}
