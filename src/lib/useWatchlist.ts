'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cerebro-watchlist';

export function useWatchlist() {
  const [watched, setWatched] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWatched(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }, []);

  const toggleWatch = useCallback(
    (id: string) => {
      setWatched((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isWatched = useCallback((id: string) => watched.has(id), [watched]);

  return { watched, toggleWatch, isWatched };
}
