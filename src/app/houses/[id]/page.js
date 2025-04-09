// src/app/houses/[id]/page.js

import { redirect, notFound } from 'next/navigation';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin'; // updated import
import Gallery from '@/app/components/Gallery';
import PropertyDetails from '@/app/components/PropertyDetails';
import PropertyDescription from '@/app/components/PropertyDescription';
import NavBar from '@/app/components/NavBar';
import SmartMap from '@/app/components/SmartMap';
import SessionAuthGuard from '@/app/components/SessionAuthGuard'; // new auth guard
import styles from '@/app/components/PropertyPage.module.css';

export const metadata = {
  title: 'Property Details',
};

export default async function PropertyPage({ params }) {
  const { id } = params;
  console.log('🔎 Fetching house with ID:', id);

  // Get the Firebase Admin Firestore instance.
  const db = getFirebaseAdminDB();
  if (!db) {
    console.error('❌ Firebase DB not initialized');
    redirect('/login');
  }

  try {
    // Fetch the house document from Firestore
    const docRef = db.collection('houses').doc(id);
    const snapshot = await docRef.get();

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
      // Wrap all UI content in SessionAuthGuard. If the session is invalid,
      // SessionAuthGuard will handle the redirection.
      <SessionAuthGuard>
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
      </SessionAuthGuard>
    );
  } catch (err) {
    console.error('🔥 Error loading house data:', err);
    notFound();
  }
}
