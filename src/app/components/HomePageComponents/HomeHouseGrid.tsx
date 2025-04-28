'use client';
import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { House } from '@/app/types/house';
import { motion } from 'framer-motion';

type HouseGridProps = {
  houses: House[];
};

export default function HomeHouseGrid({ houses }: HouseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {houses.slice(0, 6).map((house, index) => (
        <motion.div
          key={house.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-[#FAF9F6]"
        >
          <Link href={`/houses/${house.id}`}>
            <div className="relative w-full h-48 cursor-pointer">
              <Image
                src={house.images[0]?.src || '/placeholder.jpg'}
                alt={house.images[0]?.alt || house.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Link>

          <div className="p-4">
            <h2 className="text-lg font-semibold mb-1">{house.title}</h2>
            <p className="text-gray-700 mb-2">{house.price}</p>
            <div className="flex items-center text-gray-600 text-sm mb-4 space-x-4">
            <span className="text-lg font-bold">{house.size} sqft</span>
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 relative">
                  <Image src="/icons/bedroom.svg" alt="Bedrooms" fill className="object-contain" />
                </div>
                <span className="text-lg font-bold">{house.bathrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 relative">
                  <Image src="/icons/bathroom.svg" alt="Bathrooms" fill className="object-contain" />
                </div>
                <span className="text-lg font-bold">{house.bathrooms}</span>
              </div>
            </div>

            {/* ✅ View Property Button (hidden on mobile) */}
            <Link
              href={`/houses/${house.id}`}
              className="hidden sm:inline-block px-4 py-2 text-sm font-medium border border-black text-black rounded transition-colors duration-150 hover:bg-[rgb(184,161,125)] hover:border hover:border-[rgb(184,161,125)] hover:text-white"
            >
              View Property
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
