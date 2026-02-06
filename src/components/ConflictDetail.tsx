'use client';

import { ConflictWithNews, SEVERITY_COLORS } from '@/lib/types';

interface ConflictDetailProps {
  conflict: ConflictWithNews | null;
  onClose: () => void;
  isWatched?: boolean;
  onToggleWatch?: () => void;
}

export default function ConflictDetail({
  conflict,
  onClose,
  isWatched,
  onToggleWatch,
}: ConflictDetailProps) {
  if (!conflict) return null;

  return (
    <div className="border-t border-gray-700/50 bg-gray-900/95 backdrop-blur-sm">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SEVERITY_COLORS[conflict.severity] }}
              />
              <h2 className="text-sm font-bold text-gray-100 sm:text-base">
                {conflict.name}
              </h2>
              <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                {conflict.type}
              </span>
              <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                Since {conflict.startYear}
              </span>
              <a
                href={conflict.historyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded bg-blue-900/40 px-2 py-0.5 text-[10px] font-medium text-blue-400 transition-colors hover:bg-blue-900/60 hover:text-blue-300"
              >
                History &amp; Background
              </a>
              {onToggleWatch && (
                <button
                  onClick={onToggleWatch}
                  className="rounded px-2 py-0.5 text-[10px] font-medium transition-colors hover:bg-gray-800"
                  title={isWatched ? 'Unwatch conflict' : 'Watch conflict'}
                >
                  <span className={isWatched ? 'text-yellow-400' : 'text-gray-500'}>
                    {isWatched ? '\u2605' : '\u2606'} {isWatched ? 'Watching' : 'Watch'}
                  </span>
                </button>
              )}
            </div>
            <p className="mb-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
              {conflict.description}
            </p>

            {/* Timeline */}
            {conflict.timeline && conflict.timeline.length > 0 && (
              <div className="mb-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
                  Key Events:
                </span>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  {conflict.timeline.map((evt, idx) => (
                    <div key={idx} className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-bold text-gray-300">
                        {evt.year}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {evt.event}
                      </span>
                      {idx < conflict.timeline!.length - 1 && (
                        <span className="text-[10px] text-gray-700">|</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
                  Parties:
                </span>
                <div className="flex flex-wrap gap-1">
                  {conflict.parties.map((party) => (
                    <span
                      key={party}
                      className="rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] text-gray-400"
                    >
                      {party}
                    </span>
                  ))}
                </div>
              </div>
              {conflict.relatedNews.length > 0 && (
                <span className="text-[10px] text-gray-600">
                  {conflict.relatedNews.length} related article
                  {conflict.relatedNews.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {conflict.relatedNews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {conflict.relatedNews.slice(0, 3).map((article, idx) => (
                  <a
                    key={idx}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-xs truncate rounded bg-gray-800 px-2 py-1 text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    {article.source}: {article.title}
                  </a>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
