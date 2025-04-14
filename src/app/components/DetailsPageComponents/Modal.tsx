'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/app/components/DetailsPageComponents/Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  image: {
    src: string;
    alt?: string;
  };
  onClose: () => void;
};

export default function Modal({ isOpen, image, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <Image
          src={image.src}
          alt={image.alt || 'Property image'}
          width={1200}
          height={1800}
          className={styles.modalImage}
        />
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
