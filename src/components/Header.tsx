interface HeaderProps {
  lastUpdated: string;
}

export default function Header({ lastUpdated }: HeaderProps) {
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
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="hidden sm:inline">Last updated:</span>
        <span className="text-gray-400">{lastUpdated}</span>
      </div>
    </header>
  );
}
