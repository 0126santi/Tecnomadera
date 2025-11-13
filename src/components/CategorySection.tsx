import React from 'react';
import { Product } from '@/data/products';
import Link from 'next/link';
import ProductCard from './ProductCard';

export default function CategorySection({ name, products, onShowOnly }: { name: string; products: Product[]; onShowOnly?: () => void }) {
  return (
    <section className="mb-8 w-full">
      <hr className="border-t border-gray-300 mb-4" />
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-lg font-extrabold uppercase tracking-wide text-black" style={{ letterSpacing: '1px' }}>{name}</h2>
        {Array.isArray(products) && products.length > 0 && products[0]?.category && (
          <Link href={`/categoria/${products[0].category}`} className="text-sm text-gray-500 hover:text-black">
            Ver solo esta categoría
          </Link>
        )}
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-2 pt-6 pl-6"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollSnapType: 'x mandatory',
          paddingBottom: '0.5rem',
        }}
      >
        {Array.isArray(products) && products.map(prod => (
          <div
            key={prod.id}
            className="flex-shrink-0"
            style={{ width: '240px', scrollSnapAlign: 'center' }}
          >
            <ProductCard product={prod} />
          </div>
        ))}
      </div>
    </section>
  );
}
