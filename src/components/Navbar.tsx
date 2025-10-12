"use client";
import Link from 'next/link';
import { MdMenu, MdShoppingCart } from 'react-icons/md';
import { useState } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  return (
  <nav className="flex items-center justify-between py-4 px-4 sm:px-8 border-b border-gray-100 w-full" style={{ background: '#FEBA17' }}>
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-full bg-transparent hover:bg-[#FEBA17] focus:bg-[#FEBA17] transition-shadow duration-150 shadow-none hover:shadow-lg"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <MdMenu size={28} className="text-white" />
        </button>
        <Link href="/" className="text-2xl font-bold tracking-tight ml-2" style={{ color: '#111' }}>Tecnomadera</Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="hidden sm:flex w-full justify-center items-center">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>
      <div className="flex items-center gap-2">
  <Link href="/carrito" className="p-2 rounded-full bg-transparent hover:bg-[#FEBA17] focus:bg-[#FEBA17] transition-shadow duration-150 shadow-none hover:shadow-lg" aria-label="Carrito">
          <MdShoppingCart size={26} className="text-white" />
        </Link>
      </div>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </nav>
  );
}
