import { NewsArticle } from '@/lib/types';
import NewsCard from './NewsCard';

interface TechPanelProps {
  articles: NewsArticle[];
}

export default function TechPanel({ articles }: TechPanelProps) {
  if (articles.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-500">
        No tech news available
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800/50">
      {articles.map((article, idx) => (
        <NewsCard key={`${article.link}-${idx}`} article={article} />
      ))}
    </div>
  );
}
