import { Product } from '../data/products';

export type CartItem = Product & { quantity: number };

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(product: Product, quantity = 1) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === product.id);
  const qty = Math.max(1, Math.trunc(quantity));
  if (idx > -1) {
    cart[idx].quantity = Math.max(1, cart[idx].quantity + qty);
  } else {
    cart.push({ ...product, quantity: qty });
  }
  saveCart(cart);
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const qty = Math.max(1, Math.trunc(quantity));
  const cart = getCart().map((item) =>
    item.id === productId ? { ...item, quantity: qty } : item
  );
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}
