'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ConflictWithNews, NewsArticle, PolymarketEvent, ConflictFilters, Severity } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';
import { useWatchlist } from '@/lib/useWatchlist';
import { useWatchlistNotifications } from '@/lib/useNotifications';
import { useAutoRefresh } from '@/lib/useAutoRefresh';
import Header from './Header';
import SidePanel from './SidePanel';
import ConflictDetail from './ConflictDetail';
import MapLegend from './MapLegend';
import ConflictFilter from './ConflictFilter';
import MobileDrawer, { type DrawerPosition } from './MobileDrawer';
import MobileNav, { type MobileTab } from './MobileNav';

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

const ALL_SEVERITIES = new Set<Severity>(['critical', 'high', 'medium', 'low']);


export default function Dashboard({
  conflicts,
  intelArticles: ssrIntel,
  financeArticles: ssrFinance,
  techArticles: ssrTech,
  govArticles: ssrGov,
  polymarketEvents: ssrPoly,
  lastUpdated: ssrLastUpdated,
}: DashboardProps) {
  // --- Auto-refresh ---
  const {
    intelArticles,
    financeArticles,
    techArticles,
    govArticles,
    polymarketEvents,
    conflictsWithNews: liveConflicts,
    lastUpdated,
    isRefreshing,
    refresh,
  } = useAutoRefresh({
    intelArticles: ssrIntel,
    financeArticles: ssrFinance,
    techArticles: ssrTech,
    govArticles: ssrGov,
    polymarketEvents: ssrPoly,
    conflictsWithNews: conflicts,
    lastUpdated: ssrLastUpdated,
  });

  // --- Conflict selection ---
  const [selectedConflict, setSelectedConflict] =
    useState<ConflictWithNews | null>(null);

  // --- Theme & watchlist ---
  const { theme, toggleTheme } = useTheme();
  const { watched, toggleWatch, isWatched } = useWatchlist();
  useWatchlistNotifications(watched, intelArticles);

  // --- Conflict filters ---
  const [filters, setFilters] = useState<ConflictFilters>({
    severities: new Set<Severity>(ALL_SEVERITIES),
    region: '',
    type: '',
    search: '',
  });

  const filteredConflicts = useMemo(() => {
    return liveConflicts.filter((c) => {
      if (!filters.severities.has(c.severity)) return false;
      if (filters.region && c.region !== filters.region) return false;
      if (filters.type && c.type !== filters.type) return false;
      if (filters.search && !c.name.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
      return true;
    });
  }, [liveConflicts, filters]);

  // --- Mobile drawer state ---
  const [drawerPosition, setDrawerPosition] = useState<DrawerPosition>('closed');
  const [mobileTab, setMobileTab] = useState<MobileTab>('map');

  const handleMobileTabChange = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === 'map') {
      setDrawerPosition('closed');
    } else {
      setDrawerPosition((prev) => (prev === 'closed' ? 'half' : prev));
    }
  };

  return (
    <>
      <Header
        lastUpdated={lastUpdated}
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefresh={refresh}
        isRefreshing={isRefreshing}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Map area */}
          <div className="relative flex-1">
            <ConflictMap
              conflicts={filteredConflicts}
              onSelectConflict={setSelectedConflict}
              selectedConflict={selectedConflict}
              theme={theme}
            />
            <MapLegend />
            <ConflictFilter
              filters={filters}
              onFiltersChange={setFilters}
              conflicts={liveConflicts}
              filteredCount={filteredConflicts.length}
            />
          </div>

          {/* Desktop side panel */}
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

        {/* Mobile drawer + nav (replaces old static mobile panel) */}
        <div className="block md:hidden">
          <MobileDrawer
            position={drawerPosition}
            onPositionChange={setDrawerPosition}
          >
            <SidePanel
              intelArticles={intelArticles}
              financeArticles={financeArticles}
              techArticles={techArticles}
              govArticles={govArticles}
              polymarketEvents={polymarketEvents}
              controlledTab={mobileTab !== 'map' ? mobileTab as 'intel' | 'finance' | 'tech' | 'gov' | 'polymarket' : undefined}
            />
          </MobileDrawer>
          <MobileNav
            activeTab={mobileTab}
            onTabChange={handleMobileTabChange}
            drawerOpen={drawerPosition !== 'closed'}
          />
          {/* Spacer for fixed bottom nav */}
          <div className="h-14" />
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
