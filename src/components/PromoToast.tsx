"use client";
import { useState } from 'react';

export default function PromoToast() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black text-white rounded-lg px-4 py-2 shadow-lg border border-neutral-800 flex items-center gap-3">
        <div>Pago en divisas 30% descuento</div>
        <button onClick={() => setVisible(false)} className="ml-2 text-white text-sm bg-transparent hover:opacity-80">✕</button>
      </div>
    </div>
  );
}
