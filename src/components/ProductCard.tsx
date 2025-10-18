"use client";
import { Product } from '../data/products';
import { addToCart } from '../lib/cart';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalQty, setModalQty] = useState(1);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleModalAdd = () => {
    addToCart(product, modalQty);
    setAdded(true);
    // keep modal open briefly so user sees confirmation, then close
    setTimeout(() => {
      setAdded(false);
      setShowModal(false);
      setModalQty(1);
    }, 1200);
  };

  return (
    <>
  <div
    className="bg-card rounded-lg fancy-shadow p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 border card-hover transition-all duration-200 w-56 max-h-[320px] h-[320px] cursor-pointer"
  style={{ borderColor: '#294A2D' }}
        onClick={() => setShowModal(true)}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={180}
          height={120}
          className="rounded-md object-cover w-full h-20 sm:h-28 mb-1"
        />
  <h3 className="font-semibold text-base text-neutral-900 line-clamp-3 h-12">{product.name}</h3>
        <div className="flex-1 overflow-y-auto">
          <p className="text-neutral-700 text-xs break-words" style={{ whiteSpace: 'pre-line', maxHeight: '48px' }}>{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-lg text-neutral-900">{product.price}</span>
          <button
            onClick={e => { e.stopPropagation(); handleAdd(); }}
            className={`px-2 py-1 rounded text-xs font-medium transition min-w-[110px] max-w-[120px] ${added ? 'opacity-70' : ''}`}
            style={{ background: '#E96400', color: '#ffffff' }}
          >
            {added ? 'Agregado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
  {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-100 bg-opacity-90" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl" onClick={() => setShowModal(false)}>&times;</button>
            <Image src={product.image} alt={product.name} width={400} height={300} className="rounded object-cover w-full h-64 mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">{product.name}</h2>
            <p className="text-neutral-700 mb-2" style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-xl text-neutral-900">{product.price}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setModalQty(q => Math.max(1, q - 1))} className="px-2 py-1 rounded bg-neutral-200 text-lg dark:text-black">-</button>
                <span className="px-3 py-1 text-base font-medium text-neutral-900 border rounded" style={{ borderColor: '#294A2D' }}>{modalQty}</span>
                <button onClick={() => setModalQty(q => q + 1)} className="px-2 py-1 rounded bg-neutral-200 text-lg dark:text-black">+</button>
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleModalAdd(); }}
              className={`w-full py-3 rounded font-medium transition ${added ? 'opacity-70' : ''}`}
              style={{ background: '#E96400', color: '#ffffff' }}
            >{added ? 'Agregado' : 'Agregar al carrito'}</button>
          </div>
        </div>
      )}
    </>
  );
}
