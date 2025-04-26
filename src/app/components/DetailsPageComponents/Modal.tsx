// app/components/DetailsPageComponents/Modal.tsx
'use client';

import React from 'react';
import Image from 'next/image';

type ModalProps = {
  isOpen: boolean;
  image: { src: string; alt?: string };
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Modal({ isOpen, image, onClose, onPrev, onNext }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[1000]"
      onClick={onClose}
    >
      {/* Left Control Panel */}
      <div
        className="fixed left-0 top-1/2 transform -translate-y-1/2 w-24 md:w-32 lg:w-40 py-8 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          className="text-white text-8xl md:text-9xl focus:outline-none"
        >
          ‹
        </button>
      </div>

      {/* Right Control Panel */}
      <div
        className="fixed right-0 top-1/2 transform -translate-y-1/2 w-24 md:w-32 lg:w-40 py-8 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onNext}
          className="text-white text-8xl md:text-9xl focus:outline-none"
        >
          ›
        </button>
      </div>

      {/* Image Container */}
      <div
        className="relative max-w-[90%] max-h-[90%] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt || 'Property image'}
          width={1200}
          height={1800}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-4 text-white bg-black bg-opacity-60 text-xl rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
}