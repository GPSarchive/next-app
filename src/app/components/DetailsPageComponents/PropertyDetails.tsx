'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const containerRef = useRef<HTMLUListElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect after first trigger
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

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
    <ul ref={containerRef} className="list-none p-0 m-0 grid grid-cols-2 gap-2">
      {propertyInfo.map((item, index) => (
        <li
          key={`info-${index}`}
          className="flex items-center relative py-3 text-base font-medium"
        >
          <span className="w-10 h-10 flex items-center justify-center text-lg font-bold bg-black text-white rounded-full mr-4">
            {item.icon}
          </span>
          <span className="flex-1 relative">
            <strong>{item.label}:</strong> {item.value ?? '—'}
            <div
              className={`absolute bottom-[-2px] left-0 h-[2px] bg-black transition-all duration-1000 ${
                isVisible ? 'w-full' : 'w-0'
              }`}
            ></div>
          </span>
        </li>
      ))}

      {additionalCharacteristics.map((item, index) => (
        <li
          key={`extra-${index}`}
          className="flex items-center relative py-3 text-base font-medium"
        >
          <span className="flex-1 relative">
            <strong>{item.label}:</strong> {item.value ?? '—'}
            <div
              className={`absolute bottom-[-2px] left-0 h-[2px] bg-black transition-all duration-700 ${
                isVisible ? 'w-full' : 'w-0'
              }`}
            ></div>
          </span>
        </li>
      ))}
    </ul>
  );
}
