'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('cerebro-theme') as Theme | null;
    const initial = stored === 'light' ? 'light' : 'dark';
    setTheme(initial);
    document.documentElement.className = initial;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cerebro-theme', next);
      document.documentElement.className = next;
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
