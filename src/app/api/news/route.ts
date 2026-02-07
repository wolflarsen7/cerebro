import { NextRequest, NextResponse } from 'next/server';
import { fetchFeedsByCategory } from '@/lib/rss';
import { NEWS_SOURCES } from '@/lib/sources';
import {
  getConflicts,
  matchArticlesToConflicts,
  getConflictsWithNews,
} from '@/lib/conflicts';
import { NewsCategory } from '@/lib/types';

const VALID_CATEGORIES = new Set<NewsCategory>(['intel', 'finance', 'tech', 'gov']);

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category') as NewsCategory | null;

  if (!category || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json(
      { error: 'Invalid category. Use: intel, finance, tech, or gov' },
      { status: 400 },
    );
  }

  const articles = await fetchFeedsByCategory(NEWS_SOURCES, category);

  let conflictsWithNews;
  if (category === 'intel') {
    const conflicts = getConflicts();
    const matched = matchArticlesToConflicts(articles, conflicts);
    conflictsWithNews = getConflictsWithNews(conflicts, matched);

    return NextResponse.json(
      { articles: matched, conflictsWithNews, timestamp: new Date().toISOString() },
      {
        headers: { 'Cache-Control': 'public, s-maxage=120' },
      },
    );
  }

  return NextResponse.json(
    { articles, timestamp: new Date().toISOString() },
    {
      headers: { 'Cache-Control': 'public, s-maxage=120' },
    },
  );
}
