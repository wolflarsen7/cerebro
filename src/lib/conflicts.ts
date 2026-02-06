import conflictsData from '@/data/conflicts.json';
import { Conflict, NewsArticle, ConflictWithNews } from './types';

export function getConflicts(): Conflict[] {
  return conflictsData as Conflict[];
}

export function matchArticlesToConflicts(
  articles: NewsArticle[],
  conflicts: Conflict[],
): NewsArticle[] {
  return articles.map((article) => {
    const text = `${article.title} ${article.snippet}`.toLowerCase();
    const matchedConflicts: string[] = [];

    for (const conflict of conflicts) {
      const matches = conflict.keywords.some((keyword) =>
        text.includes(keyword.toLowerCase()),
      );
      if (matches) {
        matchedConflicts.push(conflict.id);
      }
    }

    return { ...article, matchedConflicts };
  });
}

export function getConflictsWithNews(
  conflicts: Conflict[],
  articles: NewsArticle[],
): ConflictWithNews[] {
  return conflicts.map((conflict) => ({
    ...conflict,
    relatedNews: articles
      .filter((a) => a.matchedConflicts?.includes(conflict.id))
      .slice(0, 5),
  }));
}
