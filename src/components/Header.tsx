'use client';

import { Theme } from '@/lib/useTheme';

interface HeaderProps {
  lastUpdated: string;
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Header({ lastUpdated, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-700/50 bg-gray-900/80 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/20">
          <svg
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.466.732-3.558"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-100 sm:text-xl">
            CEREBRO
          </h1>
          <p className="hidden text-xs text-gray-500 sm:block">
            Real-time intelligence dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="hidden sm:inline">Last updated:</span>
          <span className="text-gray-400">{lastUpdated}</span>
        </div>
      </div>
    </header>
  );
}
