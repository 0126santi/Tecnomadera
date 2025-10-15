import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.items) || typeof body.total !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const payload = {
      items: body.items,
      subtotal: body.subtotal ?? body.total,
      total: body.total,
      buyer_phone: body.buyer_phone ?? null,
      buyer_user_id: body.buyer_user_id ?? null,
      status: 'pending',
    };

    const { data, error } = await supabaseServer.from('sales').insert([payload]).select().single();
    if (error) {
      console.error('Server insert error:', error.message || error);
      return NextResponse.json({ error: error.message || 'Insert failed' }, { status: 500 });
    }

    return NextResponse.json({ sale: data }, { status: 201 });
  } catch (err) {
    console.error('API /api/sales error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
