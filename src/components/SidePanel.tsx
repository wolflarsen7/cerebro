'use client';

import { useState, useEffect } from 'react';
import { NewsArticle, PolymarketEvent } from '@/lib/types';
import NewsFeed from './NewsFeed';
import FinancePanel from './FinancePanel';
import TechPanel from './TechPanel';
import GovPanel from './GovPanel';
import PolymarketPanel from './PolymarketPanel';

type Tab = 'intel' | 'finance' | 'tech' | 'gov' | 'polymarket';

interface SidePanelProps {
  intelArticles: NewsArticle[];
  financeArticles: NewsArticle[];
  techArticles: NewsArticle[];
  govArticles: NewsArticle[];
  polymarketEvents: PolymarketEvent[];
  controlledTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; short: string }[] = [
  { id: 'intel', label: 'Intelligence', short: 'Intel' },
  { id: 'finance', label: 'Finance', short: 'Finance' },
  { id: 'tech', label: 'Tech', short: 'Tech' },
  { id: 'gov', label: 'Government', short: 'Gov' },
  { id: 'polymarket', label: 'Prediction', short: 'Poly' },
];

export default function SidePanel({
  intelArticles,
  financeArticles,
  techArticles,
  govArticles,
  polymarketEvents,
  controlledTab,
  onTabChange,
}: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>(controlledTab ?? 'intel');

  // Sync internal tab when parent requests a specific tab
  useEffect(() => {
    if (controlledTab) {
      setActiveTab(controlledTab);
    }
  }, [controlledTab]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-gray-700/50 bg-gray-900/60">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 px-2 py-2.5 text-[11px] font-medium uppercase tracking-wider transition-colors sm:text-xs ${
              activeTab === tab.id
                ? 'border-b-2 border-red-500 text-gray-200'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.short}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'intel' && <NewsFeed articles={intelArticles} />}
        {activeTab === 'finance' && (
          <FinancePanel articles={financeArticles} />
        )}
        {activeTab === 'tech' && <TechPanel articles={techArticles} />}
        {activeTab === 'gov' && <GovPanel articles={govArticles} />}
        {activeTab === 'polymarket' && (
          <PolymarketPanel events={polymarketEvents} />
        )}
      </div>
    </div>
  );
}
