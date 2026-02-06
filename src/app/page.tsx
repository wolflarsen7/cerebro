import { fetchFeedsByCategory } from '@/lib/rss';
import { NEWS_SOURCES } from '@/lib/sources';
import {
  getConflicts,
  matchArticlesToConflicts,
  getConflictsWithNews,
} from '@/lib/conflicts';
import { fetchPolymarketEvents } from '@/lib/polymarket';
import Dashboard from '@/components/Dashboard';

// ISR: revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  const conflicts = getConflicts();

  // Fetch all feeds and Polymarket in parallel
  const [
    intelArticles,
    financeArticles,
    techArticles,
    govArticles,
    polymarketEvents,
  ] = await Promise.all([
    fetchFeedsByCategory(NEWS_SOURCES, 'intel'),
    fetchFeedsByCategory(NEWS_SOURCES, 'finance'),
    fetchFeedsByCategory(NEWS_SOURCES, 'tech'),
    fetchFeedsByCategory(NEWS_SOURCES, 'gov'),
    fetchPolymarketEvents(),
  ]);

  // Match intel articles to conflicts by keyword
  const matchedIntelArticles = matchArticlesToConflicts(
    intelArticles,
    conflicts,
  );
  const conflictsWithNews = getConflictsWithNews(
    conflicts,
    matchedIntelArticles,
  );

  const lastUpdated = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Dashboard
        conflicts={conflictsWithNews}
        intelArticles={matchedIntelArticles}
        financeArticles={financeArticles}
        techArticles={techArticles}
        govArticles={govArticles}
        polymarketEvents={polymarketEvents}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}
