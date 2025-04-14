// src/app/components/DetailsContent.js
'use client';

import Gallery from '@/app/components/DetailsPageComponents/Gallery';
import PropertyDetails from '@/app/components/DetailsPageComponents/PropertyDetails';
import PropertyDescription from '@/app/components/DetailsPageComponents/PropertyDescription';
import DetailsMap from '@/app/components/DetailsPageComponents/DetailsMap';
import styles from '@/app/components/DetailsPageComponents/PropertyPage.module.css';

export default function DetailsContent({ property }) {
  return (
    <main className={styles.pageContainer}>
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
          <DetailsMap
            latitude={property.latitude}
            longitude={property.longitude}
            title={property.title}
          />
        </div>
      </div>
      <div className={styles.descriptionWrapper}>
        <PropertyDescription description={property.description || ''} />
      </div>
    </main>
  );
}