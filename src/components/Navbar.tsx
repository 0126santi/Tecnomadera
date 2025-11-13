"use client";
import Link from 'next/link';
import { MdMenu, MdShoppingCart, MdSearch } from 'react-icons/md';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSearchOpen(false);
    };
    if (mobileSearchOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileSearchOpen]);

  return (
  <nav className="relative flex items-center justify-between py-4 px-4 sm:px-8 border-b border-gray-100 w-full" style={{ background: '#0A1931' }}>
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-full bg-transparent hover:bg-[#0A1931] focus:bg-[#0A1931] transition-shadow duration-150 shadow-none hover:shadow-lg"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <MdMenu size={28} className="text-white" />
        </button>
        <Link href="/" className="text-2xl font-bold tracking-tight ml-2" style={{ color: '#fff' }}>Tecnomadera</Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="hidden sm:flex w-full justify-center items-center">
          <SearchBar value={search} onChange={setSearch} autoFocus={true} />
        </div>
        {/* Mobile: show search icon that opens a small panel (no dark background) */}
        {mobileSearchOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50">
            {/* transparent backdrop to capture outside clicks */}
            <div className="absolute inset-0" onClick={() => setMobileSearchOpen(false)} />
            <div className="relative mx-auto w-full px-4 max-w-md">
              <div className="bg-white rounded-md shadow p-2" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="flex justify-end">
                  <button aria-label="Cerrar búsqueda" onClick={() => setMobileSearchOpen(false)} className="p-1 text-gray-600 hover:text-black">✕</button>
                </div>
                <SearchBar value={search} onChange={setSearch} autoFocus={true} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
  {/* Mobile search icon */}
  <button onClick={() => setMobileSearchOpen(true)} className="p-2 rounded-full bg-transparent hover:bg-[#0A1931] focus:bg-[#0A1931] transition-shadow duration-150 shadow-none hover:shadow-lg sm:hidden" aria-label="Buscar">
    <MdSearch size={22} className="text-white" />
        </button>
  <Link href="/carrito" className="p-2 rounded-full bg-transparent hover:bg-[#0A1931] focus:bg-[#0A1931] transition-shadow duration-150 shadow-none hover:shadow-lg" aria-label="Carrito">
    <MdShoppingCart size={26} className="text-[#E96400]" />
        </Link>
      </div>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </nav>
  );
}
