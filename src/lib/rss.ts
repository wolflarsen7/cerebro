import Parser from 'rss-parser';
import { NewsArticle, NewsCategory, FeedSource } from './types';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'GlobalConflictMonitor/1.0',
    Accept: 'application/rss+xml, application/xml, text/xml',
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

export async function fetchFeed(source: FeedSource): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).slice(0, 15).map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || '#',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: source.name,
      snippet: truncate(
        stripHtml(item.contentSnippet || item.content || item.summary || ''),
        200,
      ),
      category: source.category,
    }));
  } catch (err) {
    console.error(`Failed to fetch ${source.name} (${source.url}):`, err);
    return [];
  }
}

export async function fetchAllFeeds(
  sources: FeedSource[],
): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(sources.map(fetchFeed));
  const articles: NewsArticle[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  }
  // Sort by date, newest first
  articles.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
  return articles;
}

export async function fetchFeedsByCategory(
  sources: FeedSource[],
  category: NewsCategory,
): Promise<NewsArticle[]> {
  const filtered = sources.filter((s) => s.category === category);
  return fetchAllFeeds(filtered);
}
