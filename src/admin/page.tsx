"use client";
import { useState } from 'react';
import { initialProducts, Product } from '../data/products';
import Image from 'next/image';

export default function AdminPage() {
  // Simulación de login simple (en producción usar auth real)
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<Partial<Product>>({});
  const [preview, setPreview] = useState<string | null>(null);

  if (!logged) {
    return (
      <section className="max-w-md mx-auto mt-16 p-8 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Panel de administración</h2>
        <input
          type="password"
          placeholder="Contraseña de admin"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <button
          onClick={() => setLogged(password === 'admin123')}
          className="w-full bg-black text-white py-2 rounded font-medium"
        >Entrar</button>
        <p className="text-xs text-gray-400 mt-2">Contraseña demo: admin123</p>
      </section>
    );
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      setForm(f => ({ ...f, image: file.name }));
    }
  };

  const handleAdd = () => {
    if (!form.name || !form.price || !form.category || !preview) return;
    setProducts(ps => [
      ...ps,
      { ...form, id: Date.now().toString(), image: preview, description: form.description || '' } as Product,
    ]);
    setForm({});
    setPreview(null);
  };

  const handleDelete = (id: string) => {
    setProducts(ps => ps.filter(p => p.id !== id));
  };

  return (
    <section className="max-w-2xl mx-auto mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Administrar productos</h2>
      <div className="mb-8 p-6 border rounded shadow">
        <h3 className="font-semibold mb-4">Agregar nuevo producto</h3>
        <input
          name="name"
          placeholder="Nombre"
          value={form.name || ''}
          onChange={handleInput}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description || ''}
          onChange={handleInput}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price || ''}
          onChange={handleInput}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <select
          name="category"
          value={form.category || ''}
          onChange={handleInput}
          className="w-full border rounded px-3 py-2 mb-2"
        >
          <option value="">Selecciona categoría</option>
          <option value="mesas">Mesas</option>
          <option value="sillas">Sillas</option>
          <option value="escritorios">Escritorios</option>
          <option value="estanterias">Estanterías</option>
          <option value="accesorios">Accesorios</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mb-2"
        />
        {preview && (
          <Image
            src={preview}
            alt="Vista previa"
            width={128}
            height={96}
            className="w-32 h-24 object-cover rounded mb-2"
          />
        )}
        <button onClick={handleAdd} className="w-full bg-black text-white py-2 rounded font-medium mt-2">Agregar producto</button>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Productos existentes</h3>
        <ul className="divide-y divide-gray-100">
          {products.map((prod) => (
            <li key={prod.id} className="flex items-center gap-4 py-4">
              <Image
                src={prod.image}
                alt={prod.name}
                width={80}
                height={64}
                className="w-20 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-semibold">{prod.name}</div>
                <div className="text-gray-500 text-sm">{prod.category}</div>
              </div>
              <button onClick={() => handleDelete(prod.id)} className="ml-2 text-red-500 hover:underline">Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
