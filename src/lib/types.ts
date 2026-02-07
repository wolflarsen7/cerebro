export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface TimelineEvent {
  year: number;
  event: string;
}

export interface Conflict {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: Severity;
  type: string;
  description: string;
  parties: string[];
  keywords: string[];
  region: string;
  startYear: number;
  historyUrl: string;
  timeline?: TimelineEvent[];
}

export interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceIcon?: string;
  snippet: string;
  category: NewsCategory;
  matchedConflicts?: string[];
}

export type NewsCategory = 'intel' | 'finance' | 'tech' | 'gov' | 'polymarket';

export interface FeedSource {
  name: string;
  url: string;
  category: NewsCategory;
  icon?: string;
}

export interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: number;
  liquidity: number;
  endDate: string;
  active: boolean;
  image?: string;
}

export interface ConflictWithNews extends Conflict {
  relatedNews: NewsArticle[];
}

export interface ConflictFilters {
  severities: Set<Severity>;
  region: string;
  type: string;
  search: string;
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
