'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '@/app/components/DetailsPageComponents/propertyDescription.module.css';

type PropertyDescriptionProps = {
  description: string;
};

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const paragraphs = description.split('\n');
  const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 3);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  return (
    <div
      className={styles.descriptionWrapper}
      ref={containerRef}
      style={{ maxHeight: isExpanded ? '1000px' : '1000px' }}
    >
      <h2 className={styles.descTitle}>Περιγραφή</h2>

      {visibleParagraphs.map((paragraph, index) => (
        <motion.p
          key={index}
          className={styles.paragraph}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
        >
          {paragraph}
        </motion.p>
      ))}

      {paragraphs.length > 3 && (
        <button className={styles.readMoreButton} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}
