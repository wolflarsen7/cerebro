'use client';

import { useEffect, useRef } from 'react';
import { NewsArticle } from './types';

const SEEN_KEY = 'cerebro-seen-articles';
const MAX_SEEN = 500;

function getSeenArticles(): Set<string> {
  try {
    const stored = localStorage.getItem(SEEN_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {
    // ignore
  }
  return new Set();
}

function persistSeen(seen: Set<string>) {
  const arr = [...seen];
  // Cap at MAX_SEEN, keep the newest
  const capped = arr.slice(-MAX_SEEN);
  localStorage.setItem(SEEN_KEY, JSON.stringify(capped));
}

export function useWatchlistNotifications(
  watchedIds: Set<string>,
  intelArticles: NewsArticle[],
) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (watchedIds.size === 0) return;
    hasRun.current = true;

    const seen = getSeenArticles();
    const newMatches: NewsArticle[] = [];

    for (const article of intelArticles) {
      if (!article.matchedConflicts) continue;
      const isWatchedMatch = article.matchedConflicts.some((id) =>
        watchedIds.has(id),
      );
      if (!isWatchedMatch) continue;

      const key = article.link || article.title;
      if (seen.has(key)) continue;

      seen.add(key);
      newMatches.push(article);
    }

    persistSeen(seen);

    if (newMatches.length === 0) return;

    // Request notification permission and notify
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      const count = newMatches.length;
      const title = `Cerebro: ${count} new article${count > 1 ? 's' : ''} on watched conflicts`;
      const body = newMatches
        .slice(0, 3)
        .map((a) => `${a.source}: ${a.title}`)
        .join('\n');

      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'cerebro-watchlist',
      });
    }
  }, [watchedIds, intelArticles]);
}
