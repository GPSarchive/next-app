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
  const locations = useMemo(
    () => Array.from(new Set(houses.map(h => h.location))).sort(),
    [houses]
  );
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
  const [mode, setMode] = useState<'sale' | 'rental'>('sale');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [refName, setRefName] = useState('');
  const [bedroom, setBedroom] = useState('');

  const handleApply = () => {
    const params = new URLSearchParams();
    params.set('mode', mode);
    if (category)  params.set('category', category);
    if (bedroom)   params.set('bedrooms', bedroom);
    if (minPrice)  params.set('minPrice', minPrice);
    if (maxPrice)  params.set('maxPrice', maxPrice);
    if (refName)   params.set('ref', refName);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <>
      {/* HEADER (transparent) */}
      <div className="px-2 pt-2 w-[36%] mx-auto border-t border-l border-r border-white border-[1.5px] bg-black/50">
        <h2 className="text-4xl font-serif text-center  mb-2 text-white ">
          Search Property
        </h2>
      </div>

      {/* FILTER SECTION (gray bg) */}
      <div className="px-6 pb-8 bg-gray-100">
        {/* Tabs */}
        <div className="flex justify-center w-[36.5%] mx-auto mb-6 border-b border-[#c7aebe]">
          <button
            onClick={() => setMode('sale')}
            className={`px-6 py-2 font-medium tracking-widest uppercase text-md ${
              mode === 'sale'
                ? 'text-[#c7aebe] border-b-2 border-[#c7aebe]'
                : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            Sale
          </button>
          <button
            onClick={() => setMode('rental')}
            className={`px-6 py-2 font-medium tracking-widest uppercase text-md ${
              mode === 'rental'
                ? 'text-[#c7aebe] border-b-2 border-[#c7aebe]'
                : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-300'
            }`}
          >
            Rental
          </button>
        </div>

        {/* Filters */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleApply();
          }}
          className="flex flex-wrap justify-center gap-4"
        >
          {/* Type */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-40 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          >
            <option value="">Type</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Min Price */}
          <select
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-32 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          >
            <option value="">Min Price</option>
            {prices.map(p => (
              <option key={p} value={p}>
                {p} €
              </option>
            ))}
          </select>

          {/* Max Price */}
          <select
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-32 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          >
            <option value="">Max Price</option>
            {prices.map(p => (
              <option key={p} value={p}>
                {p} €
              </option>
            ))}
          </select>

          {/* Ref. or Name */}
          <input
            type="text"
            value={refName}
            onChange={e => setRefName(e.target.value)}
            placeholder="Ref. or Name"
            className="w-48 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          />

          {/* Bedrooms */}
          <select
            value={bedroom}
            onChange={e => setBedroom(e.target.value)}
            className="w-32 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          >
            <option value="">Bedrooms</option>
            {bedrooms.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Submit */}
          <div className="w-full flex justify-center mt-6">
            <button
              type="submit"
              className="px-10 py-3 font-medium rounded-md bg-[rgb(184,161,125)] text-white text-lg tracking-wide hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
