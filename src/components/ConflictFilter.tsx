'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ConflictFilters, ConflictWithNews, Severity, SEVERITY_LABELS } from '@/lib/types';

interface ConflictFilterProps {
  filters: ConflictFilters;
  onFiltersChange: (filters: ConflictFilters) => void;
  conflicts: ConflictWithNews[];
  filteredCount: number;
}

const ALL_SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

export default function ConflictFilter({
  filters,
  onFiltersChange,
  conflicts,
  filteredCount,
}: ConflictFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const regions = Array.from(new Set(conflicts.map((c) => c.region))).sort();
  const types = Array.from(new Set(conflicts.map((c) => c.type))).sort();

  const hasActiveFilters =
    filters.severities.size < 4 ||
    filters.region !== '' ||
    filters.type !== '' ||
    filters.search !== '';

  const onSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFiltersChange({ ...filters, search: value });
      }, 200);
    },
    [filters, onFiltersChange],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const toggleSeverity = (sev: Severity) => {
    const next = new Set(filters.severities);
    if (next.has(sev)) {
      if (next.size > 1) next.delete(sev);
    } else {
      next.add(sev);
    }
    onFiltersChange({ ...filters, severities: next });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      severities: new Set<Severity>(ALL_SEVERITIES),
      region: '',
      type: '',
      search: '',
    });
  };

  return (
    <div className="absolute left-3 top-3 z-[800] w-72">
      {/* Compact bar */}
      <div className="flex items-center gap-2 rounded-lg bg-gray-900/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <svg
          className="h-4 w-4 flex-shrink-0 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search conflicts…"
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
        />
        <button
          onClick={() => setExpanded(!expanded)}
          className={`rounded p-1 transition-colors ${
            hasActiveFilters
              ? 'text-red-400 hover:bg-red-900/30'
              : 'text-gray-400 hover:bg-gray-800'
          }`}
          title="Toggle filters"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
            />
          </svg>
        </button>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="mt-2 rounded-lg bg-gray-900/95 p-3 shadow-lg backdrop-blur-sm">
          {/* Severity toggles */}
          <div className="mb-3">
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Severity
            </div>
            <div className="flex gap-1.5">
              {ALL_SEVERITIES.map((sev) => (
                <button
                  key={sev}
                  onClick={() => toggleSeverity(sev)}
                  className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                    filters.severities.has(sev)
                      ? sev === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : sev === 'high'
                          ? 'bg-orange-500/20 text-orange-400'
                          : sev === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-800 text-gray-600'
                  }`}
                >
                  {SEVERITY_LABELS[sev]}
                </button>
              ))}
            </div>
          </div>

          {/* Region dropdown */}
          <div className="mb-3">
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Region
            </div>
            <select
              value={filters.region}
              onChange={(e) => onFiltersChange({ ...filters, region: e.target.value })}
              className="w-full rounded bg-gray-800 px-2 py-1.5 text-xs text-gray-200 outline-none"
            >
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Type dropdown */}
          <div className="mb-3">
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Type
            </div>
            <select
              value={filters.type}
              onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
              className="w-full rounded bg-gray-800 px-2 py-1.5 text-xs text-gray-200 outline-none"
            >
              <option value="">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Footer: count + clear */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500">
              Showing {filteredCount} of {conflicts.length} conflicts
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-red-400 transition-colors hover:text-red-300"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
