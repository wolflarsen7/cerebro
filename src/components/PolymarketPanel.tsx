import { PolymarketEvent } from '@/lib/types';

interface PolymarketPanelProps {
  events: PolymarketEvent[];
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`;
  return `$${vol.toFixed(0)}`;
}

function formatPercent(priceStr: string): string {
  const n = parseFloat(priceStr);
  if (isNaN(n)) return '—';
  return `${(n * 100).toFixed(0)}%`;
}

export default function PolymarketPanel({ events }: PolymarketPanelProps) {
  if (events.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-500">
        No prediction markets available
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800/50">
      {events.map((event) => (
        <a
          key={event.id}
          href={`https://polymarket.com/event/${event.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group block px-4 py-3 transition-colors hover:bg-gray-800/50"
        >
          <h3 className="mb-2 text-sm font-medium leading-snug text-gray-200 group-hover:text-white">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {event.outcomes.map((outcome, i) => {
              const price = event.outcomePrices[i];
              const pct = price ? parseFloat(price) * 100 : 0;
              const isYes = outcome.toLowerCase() === 'yes';
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded bg-gray-800 px-2 py-1"
                >
                  <span className="text-xs text-gray-400">{outcome}</span>
                  <span
                    className={`text-xs font-semibold ${
                      isYes
                        ? pct > 50
                          ? 'text-green-400'
                          : 'text-gray-300'
                        : pct > 50
                          ? 'text-red-400'
                          : 'text-gray-300'
                    }`}
                  >
                    {price ? formatPercent(price) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-1.5 text-[10px] text-gray-600">
            Vol: {formatVolume(event.volume)}
          </div>
        </a>
      ))}
    </div>
  );
}
