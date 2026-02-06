import { NewsArticle } from '@/lib/types';

interface NewsCardProps {
  article: NewsArticle;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-b border-gray-800 px-4 py-3 transition-colors hover:bg-gray-800/50"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-gray-700/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
          {article.source}
        </span>
        <span className="text-[10px] text-gray-600">
          {timeAgo(article.pubDate)}
        </span>
      </div>
      <h3 className="mb-1 text-sm font-medium leading-snug text-gray-200 group-hover:text-white">
        {article.title}
      </h3>
      {article.snippet && (
        <p className="text-xs leading-relaxed text-gray-500 line-clamp-2">
          {article.snippet}
        </p>
      )}
    </a>
  );
}
