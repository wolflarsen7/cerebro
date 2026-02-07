'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle, PolymarketEvent, ConflictWithNews } from './types';

interface AutoRefreshData {
  intelArticles: NewsArticle[];
  financeArticles: NewsArticle[];
  techArticles: NewsArticle[];
  govArticles: NewsArticle[];
  polymarketEvents: PolymarketEvent[];
  conflictsWithNews: ConflictWithNews[];
  lastUpdated: string;
  isRefreshing: boolean;
  refresh: () => void;
}

interface InitialData {
  intelArticles: NewsArticle[];
  financeArticles: NewsArticle[];
  techArticles: NewsArticle[];
  govArticles: NewsArticle[];
  polymarketEvents: PolymarketEvent[];
  conflictsWithNews: ConflictWithNews[];
  lastUpdated: string;
}

function formatTimestamp(): string {
  return new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}

export function useAutoRefresh(
  initial: InitialData,
  intervalMs: number = 5 * 60 * 1000,
): AutoRefreshData {
  const [intelArticles, setIntelArticles] = useState(initial.intelArticles);
  const [financeArticles, setFinanceArticles] = useState(initial.financeArticles);
  const [techArticles, setTechArticles] = useState(initial.techArticles);
  const [govArticles, setGovArticles] = useState(initial.govArticles);
  const [polymarketEvents, setPolymarketEvents] = useState(initial.polymarketEvents);
  const [conflictsWithNews, setConflictsWithNews] = useState(initial.conflictsWithNews);
  const [lastUpdated, setLastUpdated] = useState(initial.lastUpdated);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setIsRefreshing(true);

    try {
      const results = await Promise.allSettled([
        fetch('/api/news?category=intel').then((r) => r.json()),
        fetch('/api/news?category=finance').then((r) => r.json()),
        fetch('/api/news?category=tech').then((r) => r.json()),
        fetch('/api/news?category=gov').then((r) => r.json()),
        fetch('/api/polymarket').then((r) => r.json()),
      ]);

      if (results[0].status === 'fulfilled' && results[0].value.articles) {
        setIntelArticles(results[0].value.articles);
        if (results[0].value.conflictsWithNews) {
          setConflictsWithNews(results[0].value.conflictsWithNews);
        }
      }
      if (results[1].status === 'fulfilled' && results[1].value.articles) {
        setFinanceArticles(results[1].value.articles);
      }
      if (results[2].status === 'fulfilled' && results[2].value.articles) {
        setTechArticles(results[2].value.articles);
      }
      if (results[3].status === 'fulfilled' && results[3].value.articles) {
        setGovArticles(results[3].value.articles);
      }
      if (results[4].status === 'fulfilled' && results[4].value.events) {
        setPolymarketEvents(results[4].value.events);
      }

      setLastUpdated(formatTimestamp());
    } finally {
      refreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);

  return {
    intelArticles,
    financeArticles,
    techArticles,
    govArticles,
    polymarketEvents,
    conflictsWithNews,
    lastUpdated,
    isRefreshing,
    refresh,
  };
}
