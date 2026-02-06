import { PolymarketEvent } from './types';

const POLYMARKET_API = 'https://gamma-api.polymarket.com';

interface PolymarketApiEvent {
  id: string;
  title: string;
  slug: string;
  outcomes: string;
  outcomePrices: string;
  volume: number;
  liquidity: number;
  endDate: string;
  active: boolean;
  image?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const GEO_KEYWORDS = [
  'war',
  'conflict',
  'military',
  'invasion',
  'sanctions',
  'nato',
  'china',
  'russia',
  'ukraine',
  'iran',
  'israel',
  'taiwan',
  'nuclear',
  'missile',
  'ceasefire',
  'election',
  'president',
  'prime minister',
  'tariff',
  'trade war',
  'oil',
  'opec',
  'trump',
  'biden',
  'congress',
  'senate',
  'geopolit',
  'diplomat',
  'peace',
  'treaty',
];

export async function fetchPolymarketEvents(): Promise<PolymarketEvent[]> {
  try {
    const res = await fetch(
      `${POLYMARKET_API}/events?active=true&closed=false&limit=50&order=volume24hr&ascending=false`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'GlobalConflictMonitor/1.0',
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      throw new Error(`Polymarket API returned ${res.status}`);
    }

    const events: PolymarketApiEvent[] = await res.json();

    // Filter for geopolitics/world events relevance
    const filtered = events.filter((event) => {
      const text = event.title.toLowerCase();
      return GEO_KEYWORDS.some((kw) => text.includes(kw));
    });

    return filtered.slice(0, 20).map((event) => {
      let outcomes: string[] = [];
      let outcomePrices: string[] = [];

      try {
        outcomes = JSON.parse(event.outcomes || '[]');
      } catch {
        outcomes = [];
      }
      try {
        outcomePrices = JSON.parse(event.outcomePrices || '[]');
      } catch {
        outcomePrices = [];
      }

      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        outcomes,
        outcomePrices,
        volume: event.volume || 0,
        liquidity: event.liquidity || 0,
        endDate: event.endDate || '',
        active: event.active,
        image: event.image,
      };
    });
  } catch (err) {
    console.error('Failed to fetch Polymarket events:', err);
    return [];
  }
}
