"use client";
import { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateCartQuantity, clearCart, CartItem } from '../../lib/cart';
import Image from 'next/image';

export default function CarritoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleQuantity = (id: string, qty: number) => {
    updateCartQuantity(id, qty);
    setCart(getCart());
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="w-full max-w-4xl mx-auto px-2 sm:px-0">
  <h2 className="text-2xl font-extrabold uppercase tracking-wide text-black mb-8" style={{ letterSpacing: '1px' }}>Carrito de compras</h2>
      {cart.length === 0 ? (
        <p className="text-neutral-700 text-center">Tu carrito está vacío.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tabla de productos */}
          <div>
            <table className="w-full text-left border-separate border-spacing-y-2 table-fixed">
              <thead>
                <tr className="text-xs font-bold text-neutral-700 border-b">
                  <th className="pb-2 px-2 w-2/5">PRODUCTO</th>
                  <th className="pb-2 px-2 w-1/5">PRECIO</th>
                  <th className="pb-2 px-2 w-1/5">CANTIDAD</th>
                  <th className="pb-2 px-2 w-1/5">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id} className="align-middle">
                    {/* Responsive: mostrar cada celda como bloque en móvil, con más espacio */}
                    <td className="flex items-center gap-3 py-2 sm:flex-row flex-col sm:items-center items-start">
                      <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-500 text-lg font-bold">×</button>
                      <Image src={item.image} alt={item.name} width={60} height={60} className="rounded object-cover w-16 h-16" />
                      <span className="font-medium text-neutral-900 text-sm whitespace-pre-line">{item.name}</span>
                    </td>
                    <td className="font-semibold text-neutral-900 text-center sm:text-left sm:align-middle align-top sm:py-0 py-2 sm:mb-0 mb-3 sm:ml-0 ml-6">
                      <div className="block sm:inline mb-2 sm:mb-0">${item.price.toFixed(2)}</div>
                    </td>
                    <td className="sm:align-middle align-top sm:py-0 py-2 sm:mb-0 mb-3">
                      <div className="block sm:inline mb-2 sm:mb-0">
                        <div className="flex items-center border rounded w-fit mx-auto" style={{ borderColor: '#4E1F00' }}>
                          <button onClick={() => handleQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-lg font-bold text-gray-700" disabled={item.quantity <= 1}>-</button>
                          <span className="px-3 py-1 text-base font-medium text-neutral-900 dark:text-black">{item.quantity}</span>
                          <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-lg font-bold text-gray-700">+</button>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-neutral-900 text-center sm:text-left sm:align-middle align-top sm:py-0 py-2 sm:mb-0 mb-3 sm:ml-0 ml-6">
                      <div className="block sm:inline mb-2 sm:mb-0 mt-2 sm:mt-0">${(item.price * item.quantity).toFixed(2)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col gap-2 mt-6">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2 rounded font-medium transition"
                    style={{ background: '#F6B61E', color: '#4E1F00' }}
                  >← SEGUIR COMPRANDO</button>
                  <button
                    onClick={() => { clearCart(); setCart([]); }}
                    className="px-6 py-2 rounded font-medium transition"
                    style={{ background: '#FFEBAF', color: '#4E1F00' }}
                  >Vaciar carrito</button>
            </div>
          </div>
          {/* Totales */}
          <div className="bg-neutral-50 rounded-xl p-6 border flex flex-col gap-4" style={{ borderColor: '#4E1F00' }}>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">TOTALES DEL CARRITO</h3>
            <div className="flex justify-between text-neutral-700 text-base">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-neutral-900 text-lg font-bold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              className="mt-4 px-6 py-3 rounded font-medium transition"
              style={{ background: '#FEBA17', color: '#4E1F00' }}
              onClick={() => {
                if (!cart || cart.length === 0) return;
                const numeroWhatsapp = '584244446227';
                const mensaje = encodeURIComponent(
                  "Hola, quiero comprar:\n" +
                  cart.map(p => `- ${p.name} (${p.quantity} unidades) - $${(p.price * p.quantity).toFixed(2)}`).join('\n') +
                  `\nTotal: $${subtotal.toFixed(2)}`
                );
                window.open(`https://wa.me/${numeroWhatsapp}?text=${mensaje}`, '_blank');
              }}
            >
              FINALIZAR COMPRA POR WHATSAPP
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
