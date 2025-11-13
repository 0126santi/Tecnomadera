"use client";
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchProducts } from '../lib/productsApi';
// ...existing code...
import CategorySection from '../components/CategorySection';
import PromoToast from '../components/PromoToast';
import { categories } from '../data/categories';
import { Product } from '../data/products';
// ...existing code...

export default function Home() {
  const [showOnly, setShowOnly] = useState<string | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<{ key: string; name: string; products: Product[] }[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const all = await Promise.all(
        categories.map(async cat => ({
          ...cat,
          products: await fetchProducts(cat.key)
        }))
      );
      setProductsByCategory(all);
    }
    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <PromoToast />
      <div className="w-full px-0 py-6">
        {/* Solo mostrar las categorías */}
        {showOnly
          ? productsByCategory.filter(cat => cat.key === showOnly).map(cat => (
              <CategorySection
                key={cat.key}
                name={cat.name}
                products={cat.products}
                onShowOnly={() => setShowOnly(null)}
              />
            ))
          : productsByCategory.map(cat => (
              <CategorySection
                key={cat.key}
                name={cat.name}
                products={cat.products}
                onShowOnly={() => setShowOnly(cat.key)}
              />
            ))}
      </div>
    </main>
  );
}
