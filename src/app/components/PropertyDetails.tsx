import React from 'react';
import styles from '@/app/components/PropertyDetails.module.css';
type PropertyDetailsProps = {
  property: {
    category?: string;
    price?: string;
    size?: string;
    bedrooms?: number;
    parking?: string;
    floor?: string;
    energyClass?: string;
    yearBuilt?: string;
    kitchens?: string;
    heatingType?: string;
    specialFeatures?: string;
    windowType?: string;
    hasHeating?: string;
    suitableFor?: string;
  };
};

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const propertyInfo = [
    { icon: '🏠', label: 'Κατηγορία', value: property.category },
    { icon: '💲', label: 'Τιμή', value: property.price },
    { icon: '📐', label: 'Εμβαδόν', value: property.size },
    { icon: '🛏', label: 'Υπνοδωμάτια', value: property.bedrooms },
    { icon: '🚗', label: 'Parking', value: property.parking },
    { icon: '🏢', label: 'Όροφος', value: property.floor },
    { icon: '⚡', label: 'Ενεργ. Κλάση', value: property.energyClass },
    { icon: '🔨', label: 'Έτος Κατασκευής', value: property.yearBuilt },
  ];

  const additionalCharacteristics = [
    { label: '■ Κουζίνες', value: property.kitchens },
    { label: '■ Μέσον Θέρμανσης', value: property.heatingType },
    { label: '■ Ιδιαίτερα Χαρακτηριστικά', value: property.specialFeatures },
    { label: '■ Κουφώματα', value: property.windowType },
    { label: '■ Θέρμανση', value: property.hasHeating },
    { label: '■ Κατάλληλο για', value: property.suitableFor },
  ];

  return (
    <ul className={styles.detailsList}>
      {propertyInfo.map((item, index) => (
        <li key={`info-${index}`} className={styles.detailItem}>
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.text}>
            <strong>{item.label}:</strong> {item.value ?? '—'}
          </span>
          <div className={styles.underline} />
        </li>
      ))}

      {additionalCharacteristics.map((item, index) => (
        <li key={`extra-${index}`} className={styles.detailItem}>
          <span className={styles.text}>
            <strong>{item.label}:</strong> {item.value ?? '—'}
          </span>
          <div className={styles.underline} />
        </li>
      ))}
    </ul>
  );
}
