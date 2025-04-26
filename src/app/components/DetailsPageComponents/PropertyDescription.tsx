// app/components/DetailsPageComponents/PropertyDescription.tsx
'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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
      ref={containerRef}
      className="relative pb-8 max-h-[1000px] transition-all"
    >
      <h2 className="mb-3 text-[1.4rem] font-semibold text-[#111] tracking-wide capitalize">
        Περιγραφή
      </h2>

      {visibleParagraphs.map((paragraph, index) => (
        <motion.p
          key={index}
          className="mb-4 font-normal text-[#444] text-justify whitespace-pre-line"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
        >
          {paragraph}
        </motion.p>
      ))}

      {paragraphs.length > 3 && (
        <button
          className="mt-2 text-base font-semibold text-black hover:opacity-70 transition-opacity"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}