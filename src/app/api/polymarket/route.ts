import { NextResponse } from 'next/server';
import { fetchPolymarketEvents } from '@/lib/polymarket';

export async function GET() {
  const events = await fetchPolymarketEvents();

  return NextResponse.json(
    { events, timestamp: new Date().toISOString() },
    {
      headers: { 'Cache-Control': 'public, s-maxage=120' },
    },
  );
}
