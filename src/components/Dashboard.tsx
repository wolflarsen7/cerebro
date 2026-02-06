'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ConflictWithNews, NewsArticle, PolymarketEvent } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';
import { useWatchlist } from '@/lib/useWatchlist';
import { useWatchlistNotifications } from '@/lib/useNotifications';
import Header from './Header';
import SidePanel from './SidePanel';
import ConflictDetail from './ConflictDetail';
import MapLegend from './MapLegend';

// Leaflet must be client-only (no SSR)
const ConflictMap = dynamic(() => import('./ConflictMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-900">
      <div className="text-gray-500">Loading map…</div>
    </div>
  ),
});

interface DashboardProps {
  conflicts: ConflictWithNews[];
  intelArticles: NewsArticle[];
  financeArticles: NewsArticle[];
  techArticles: NewsArticle[];
  govArticles: NewsArticle[];
  polymarketEvents: PolymarketEvent[];
  lastUpdated: string;
}

export default function Dashboard({
  conflicts,
  intelArticles,
  financeArticles,
  techArticles,
  govArticles,
  polymarketEvents,
  lastUpdated,
}: DashboardProps) {
  const [selectedConflict, setSelectedConflict] =
    useState<ConflictWithNews | null>(null);

  const { theme, toggleTheme } = useTheme();
  const { watched, toggleWatch, isWatched } = useWatchlist();

  useWatchlistNotifications(watched, intelArticles);

  return (
    <>
      <Header
        lastUpdated={lastUpdated}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Map area */}
          <div className="relative flex-1">
            <ConflictMap
              conflicts={conflicts}
              onSelectConflict={setSelectedConflict}
              selectedConflict={selectedConflict}
              theme={theme}
            />
            <MapLegend />
          </div>

          {/* Side panel */}
          <div className="hidden w-[380px] flex-shrink-0 border-l border-gray-700/50 bg-gray-950 md:block lg:w-[420px]">
            <SidePanel
              intelArticles={intelArticles}
              financeArticles={financeArticles}
              techArticles={techArticles}
              govArticles={govArticles}
              polymarketEvents={polymarketEvents}
            />
          </div>
        </div>

        {/* Mobile side panel toggle (shows below map on small screens) */}
        <div className="block md:hidden">
          <div className="h-[45vh] border-t border-gray-700/50 bg-gray-950">
            <SidePanel
              intelArticles={intelArticles}
              financeArticles={financeArticles}
              techArticles={techArticles}
              govArticles={govArticles}
              polymarketEvents={polymarketEvents}
            />
          </div>
        </div>

        {/* Conflict detail bar */}
        <ConflictDetail
          conflict={selectedConflict}
          onClose={() => setSelectedConflict(null)}
          isWatched={selectedConflict ? isWatched(selectedConflict.id) : false}
          onToggleWatch={
            selectedConflict
              ? () => toggleWatch(selectedConflict.id)
              : undefined
          }
        />
      </div>
    </>
  );
}
