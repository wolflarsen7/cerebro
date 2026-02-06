import { FeedSource } from './types';

export const NEWS_SOURCES: FeedSource[] = [
  // World / Conflict News (bias-balanced)
  {
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'intel',
  },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'intel',
  },
  {
    name: 'NPR World',
    url: 'https://feeds.npr.org/1004/rss.xml',
    category: 'intel',
  },

  // Financial
  {
    name: 'CNBC',
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    category: 'finance',
  },
  {
    name: 'MarketWatch',
    url: 'https://www.marketwatch.com/rss/topstories',
    category: 'finance',
  },

  // Tech
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'tech',
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    category: 'tech',
  },

  // Government / Geopolitical
  {
    name: 'UN News',
    url: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml',
    category: 'gov',
  },
  {
    name: 'CFR',
    url: 'https://www.cfr.org/rss.xml',
    category: 'gov',
  },
];
