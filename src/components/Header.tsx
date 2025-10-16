import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (value: string) => {
    setSearch(value);
    // Puedes agregar lógica para buscar productos
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b w-full" style={{ background: '#0A1931' }}>
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <span className="text-xl">☰</span>
        </button>
  <Link href="/" className="text-2xl font-bold tracking-tight text-white ml-2">Tecnomadera</Link>
      </div>
      <div className="flex-1 flex justify-center">
        <SearchBar value={search} onChange={handleSearch} />
      </div>
      <div className="flex items-center gap-2">
        <Link href="/carrito" className="p-2 rounded-md bg-gray-100 hover:bg-gray-200" aria-label="Carrito">
          <span className="text-xl" style={{ color: '#E96400' }}>🛒</span>
        </Link>
      </div>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
}
