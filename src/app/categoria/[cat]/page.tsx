import { categories } from '@/data/categories';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import { fetchProducts } from '@/lib/productsApi';

export default async function CategoriaPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const categoria = categories.find((c: { key: string }) => c.key === cat);
  if (!categoria) return notFound();
  const productos = await fetchProducts(cat);

  return (
    <section>
  <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black mb-8 text-center" style={{ letterSpacing: '1px' }}>{categoria.name}</h2>
      {productos.length === 0 ? (
  <p className="text-neutral-700 text-center">No hay productos en esta categoría.</p>
      ) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 px-2 sm:px-0 w-full sm:max-w-6xl mx-auto justify-center place-items-center"
    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {productos.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </section>
  );
}
