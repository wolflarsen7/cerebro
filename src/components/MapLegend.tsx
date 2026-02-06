'use client';

import { SEVERITY_COLORS, SEVERITY_LABELS, Severity } from '@/lib/types';

const severities: Severity[] = ['critical', 'high', 'medium', 'low'];

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-gray-900/90 px-3 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {severities.map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: SEVERITY_COLORS[s] }}
            />
            <span className="text-[10px] text-gray-400">
              {SEVERITY_LABELS[s]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
