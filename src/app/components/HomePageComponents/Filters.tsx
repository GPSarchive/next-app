'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { House } from '@/app/types/house';

interface Props {
  houses: House[];
}

export default function Filters({ houses }: Props) {
  const router = useRouter();

  // derive unique filter options
  const categories = useMemo(
    () => Array.from(new Set(houses.map(h => h.category))).sort(),
    [houses]
  );
  const bedrooms = useMemo(
    () => Array.from(new Set(houses.map(h => h.bedrooms))).sort((a, b) => +a - +b),
    [houses]
  );
  const prices = useMemo(() => {
    const nums = houses
      .map(h => parseInt(h.price, 10))
      .filter(n => !isNaN(n));
    return Array.from(new Set(nums)).sort((a, b) => a - b);
  }, [houses]);

  // local selection state
  const [category,  setCategory ] = useState('');
  const [minPrice,  setMinPrice ] = useState('');
  const [maxPrice,  setMaxPrice ] = useState('');
  const [bedroom,   setBedroom  ] = useState('');

  const handleApply = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (bedroom)  params.set('bedrooms', bedroom);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="border-t border-gray-200 py-6">
      <form
        onSubmit={e => {
          e.preventDefault();
          handleApply();
        }}
        className="flex flex-wrap justify-center gap-4"
      >
        {/* Category */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-40 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Type</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Min Price */}
        <select
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="w-32 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Min Price</option>
          {prices.map(p => (
            <option key={p} value={p}>{p} €</option>
          ))}
        </select>

        {/* Max Price */}
        <select
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="w-32 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Max Price</option>
          {prices.map(p => (
            <option key={p} value={p}>{p} €</option>
          ))}
        </select>

        {/* Bedrooms */}
        <select
          value={bedroom}
          onChange={e => setBedroom(e.target.value)}
          className="w-32 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Bedrooms</option>
          {bedrooms.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Submit Button Container */}
        <div className="w-full flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 font-medium rounded-lg bg-[rgb(184,161,125)] text-white border border-transparent transition-colors duration-150 hover:bg-white hover:text-black hover:border-black"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}