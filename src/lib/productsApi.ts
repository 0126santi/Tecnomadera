import { supabase } from './supabaseClient';
import { Product } from '@/data/products';

export async function fetchProducts(category?: string): Promise<Product[]> {
  // Try ordering by 'position' (manual order). If the column doesn't exist,
  // fallback to created_at or name ordering to avoid runtime errors.
  try {
    let query = supabase.from('products').select('*').order('position', { ascending: true });
    if (category) query = query.eq('category', category);
  const { data, error } = await query;
    if (error) {
      const msg = (error.message || '').toLowerCase();
      // If position doesn't exist, fallback to created_at
      if (msg.includes('position') || msg.includes('column') || msg.includes('does not exist')) {
        console.warn('fetchProducts: position column missing, falling back to created_at ordering');
        let q2 = supabase.from('products').select('*').order('created_at', { ascending: false });
        if (category) q2 = q2.eq('category', category);
        const { data: d2, error: e2 } = await q2;
        if (e2) {
          console.error('fetchProducts fallback error', e2);
          // final fallback: order by name
          let q3 = supabase.from('products').select('*').order('name');
          if (category) q3 = q3.eq('category', category);
          const { data: d3, error: e3 } = await q3;
          if (e3) {
            console.error('fetchProducts final fallback error', e3);
            return [] as Product[];
          }
          return d3 as Product[];
        }
        return d2 as Product[];
      }
      console.error('fetchProducts error', error);
      return [] as Product[];
    }
    return data as Product[];
  } catch (err) {
    console.error('fetchProducts unexpected error', err);
    return [] as Product[];
  }
}

type UpdateFields = Record<string, unknown>;

export async function updateProduct(id: string, updates: Partial<Product> & UpdateFields): Promise<Product | null> {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) {
    console.error('updateProduct error', error);
    return null;
  }
  return data as Product;
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
