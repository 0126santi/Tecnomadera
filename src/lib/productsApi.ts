import { supabase } from './supabaseClient';
import { Product } from '@/data/products';

export async function fetchProducts(category?: string): Promise<Product[]> {
  // Try ordering by created_at (newest first). If the column doesn't exist
  // fallback to ordering by name to avoid throwing an unhandled error at runtime.
  try {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error) {
      // If created_at doesn't exist, fallback to name ordering
      const msg = (error.message || '').toLowerCase();
      if (msg.includes('created_at') || msg.includes('column') || msg.includes('does not exist')) {
        console.warn('fetchProducts: created_at column missing, falling back to name ordering');
        let fallback = supabase.from('products').select('*').order('name');
        if (category) fallback = fallback.eq('category', category);
        const { data: d2, error: e2 } = await fallback;
        if (e2) {
          console.error('fetchProducts fallback error', e2);
          return [] as Product[];
        }
        return d2 as Product[];
      }
      console.error('fetchProducts error', error);
      return [] as Product[];
    }
    return data as Product[];
  } catch (err) {
    console.error('fetchProducts unexpected error', err);
    // As a last resort, return empty list to keep the UI alive
    return [] as Product[];
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const { data, error } = await supabase.from('products').insert([product]).select().single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
