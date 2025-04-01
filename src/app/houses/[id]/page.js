// src/app/houses/[id]/page.js

import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getFirebaseAdmin } from '@/app/lib/firebaseAdmin';

import Gallery from '@/app/components/Gallery';
import PropertyDetails from '@/app/components/PropertyDetails';
import PropertyDescription from '@/app/components/PropertyDescription';
import NavBar from '@/app/components/NavBar';
import SmartMap from '@/app/components/SmartMap';
import styles from '@/app/components/PropertyPage.module.css';

export const metadata = {
  title: 'Property Details',
};

export default async function PropertyPage({ params }) {
  const { id } = params;
  const cookieStore = cookies();
  const token = (await cookieStore).get('__session')?.value;
  console.log('🔎 Fetching house with ID:', id);
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
    console.log('Snapshot exists:', snapshot.exists);
    console.log('Snapshot data:', snapshot.data());

    if (!snapshot.exists) {
      console.warn('❌ House not found:', id);
      notFound();
    }

    const property = { id: snapshot.id, ...snapshot.data() };

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
            images={property.images.map((image, index) => ({
              src: image.src,
              alt: image.alt || `Property image ${index + 1}`,
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
          <PropertyDescription description={property.description || ''} />
        </div>
      </main>
    );
  } catch (err) {
    console.error('🔥 Error loading house data:', err);
    notFound();
  }
}
