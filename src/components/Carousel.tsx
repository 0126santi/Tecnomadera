import React from 'react';
import Image from 'next/image';

import { Product } from '@/data/products';
export default function Carousel({ products }: { products: Product[] }) {
  const [current, setCurrent] = React.useState(0);
  if (!products.length) return null;
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <Image
          src={products[current].image}
          alt={products[current].name}
          width={900}
          height={400}
          className="w-full h-48 sm:h-80 object-cover"
        />
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-black' : 'bg-gray-300'}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}
