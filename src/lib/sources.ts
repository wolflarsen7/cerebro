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
  {
    name: 'The Hill',
    url: 'https://thehill.com/feed/',
    category: 'intel',
  },
  {
    name: 'AP News',
    url: 'https://feedx.net/rss/ap.xml',
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
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'tech',
  },

  // Government / Geopolitical
  {
    name: 'UN Peace & Security',
    url: 'https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml',
    category: 'gov',
  },
  {
    name: 'Defense.gov',
    url: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945',
    category: 'gov',
  },
  {
    name: 'Foreign Affairs',
    url: 'https://www.foreignaffairs.com/rss.xml',
    category: 'gov',
  },
  {
    name: 'Politico',
    url: 'https://www.politico.com/rss/politicopicks.xml',
    category: 'gov',
  },
  {
    name: 'Defense One',
    url: 'https://www.defenseone.com/rss/all/',
    category: 'gov',
  },
  {
    name: 'War on the Rocks',
    url: 'https://warontherocks.com/feed/',
    category: 'gov',
  },
];
