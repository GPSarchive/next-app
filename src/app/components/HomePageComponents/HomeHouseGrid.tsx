'use client';

import Image from 'next/image';
import Link from 'next/link';
import { House } from '@/app/types/house';

type HouseGridProps = {
  houses: House[];
};

export default function HomeHouseGrid({ houses }: HouseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {houses.slice(0, 6).map((house) => (
        <div
          key={house.id}
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
            <p className="text-gray-600 text-sm mb-4">
              {house.size} sqft &bull; {house.bedrooms} bd &bull; {house.bathrooms} ba
            </p>

            {/* ✅ View Property Button (hidden on mobile) */}
            <Link
              href={`/houses/${house.id}`}
              className="hidden sm:inline-block px-4 py-2 text-sm font-medium border border-black text-black rounded transition-colors duration-150 hover:bg-black hover:text-white"
            >
              View Property
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
