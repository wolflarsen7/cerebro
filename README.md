# Cerebro

Real-time intelligence dashboard tracking global conflicts with an interactive map, multi-source news feeds, and prediction market data.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** React 19, Tailwind CSS 4
- **Maps:** Leaflet + react-leaflet
- **Data:** RSS feeds (rss-parser), Polymarket API, static conflict JSON
- **Rendering:** Server-side with ISR (revalidates every hour)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, Leaflet CSS CDN link
│   ├── page.tsx            # Server component — fetches all data in parallel
│   └── globals.css         # Tailwind config + Leaflet dark theme overrides
├── components/
│   ├── Dashboard.tsx       # Main layout: map + side panel + detail bar
│   ├── ConflictMap.tsx     # Leaflet map with severity-coded circle markers
│   ├── Header.tsx          # Top bar with title + last-updated timestamp
│   ├── SidePanel.tsx       # Tabbed container (Intel/Finance/Tech/Gov/Polymarket)
│   ├── ConflictDetail.tsx  # Bottom drawer when a conflict is selected
│   ├── NewsFeed.tsx        # Scrollable list of NewsCard components
│   ├── NewsCard.tsx        # Individual article card (title, source, time, snippet)
│   ├── FinancePanel.tsx    # Finance news feed wrapper
│   ├── TechPanel.tsx       # Tech news feed wrapper
│   ├── GovPanel.tsx        # Government news feed wrapper
│   ├── PolymarketPanel.tsx # Prediction market event cards with probabilities
│   └── MapLegend.tsx       # Severity color legend overlay
├── lib/
│   ├── types.ts            # All TypeScript interfaces and constants
│   ├── sources.ts          # RSS feed source URLs and categories
│   ├── rss.ts              # RSS fetch/parse logic with error recovery
│   ├── polymarket.ts       # Polymarket API client + geo-keyword filter
│   └── conflicts.ts        # Loads conflict data, keyword matching logic
└── data/
    └── conflicts.json      # 28 active global conflicts with metadata
```

## How Data Flows

1. `page.tsx` (server component) runs at build time + every hour (ISR)
2. It calls `fetchFeedsByCategory()` for each news tab and `fetchPolymarketEvents()` in parallel
3. Intel articles are keyword-matched to conflicts via `matchArticlesToConflicts()`
4. All data is passed as props to the `Dashboard` client component
5. User interactions (map clicks, tab switches) are handled client-side with React state

## Running Locally

```bash
cd global-conflict-monitor
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve production build
```

## Deployment

### Option A: Vercel (Recommended)

Vercel is the simplest option for Next.js — zero config, free tier available.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time — will prompt to link/create project)
vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repo at https://vercel.com/new — it auto-deploys on every push.

### Option B: Fly.io

You already have Fly CLI installed. Create a Dockerfile and fly.toml:

**1. Create `Dockerfile`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**2. Add `output: 'standalone'` to `next.config.ts`:**
```ts
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

**3. Create `fly.toml`:**
```toml
app = "cerebro"
primary_region = "iad"

[build]

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
  cpus = 1
```

**4. Deploy:**
```bash
fly launch     # first time
fly deploy     # subsequent deploys
```

### Option C: Any Node.js Host

```bash
npm run build
npm start       # starts on port 3000
```

Set `PORT` env var if your host requires a different port.

## Making Changes

### Add or edit a conflict

Edit `src/data/conflicts.json`. Each conflict has:

```json
{
  "id": "unique-slug",
  "name": "Display Name",
  "lat": 0.0,
  "lng": 0.0,
  "severity": "critical|high|medium|low",
  "type": "Short type label",
  "description": "1-2 sentence summary",
  "parties": ["Party A", "Party B"],
  "keywords": ["keyword1", "keyword2"],
  "region": "Region Name",
  "startYear": 2024,
  "historyUrl": "https://en.wikipedia.org/wiki/..."
}
```

- **keywords** are used to match RSS articles to this conflict (case-insensitive substring match)
- **severity** controls marker size and color on the map (see `SEVERITY_COLORS` in `types.ts`)
- **historyUrl** appears as a "History & Background" link in the detail panel

### Add or change an RSS source

Edit `src/lib/sources.ts`. Add an entry:

```ts
{
  name: 'Source Name',
  url: 'https://example.com/rss.xml',
  category: 'intel' | 'finance' | 'tech' | 'gov',
}
```

The category determines which tab the articles appear under.

### Change Polymarket keyword filters

Edit `GEO_KEYWORDS` array in `src/lib/polymarket.ts`. Events whose title contains any keyword are included.

### Change revalidation interval

Edit `export const revalidate = 3600` in `src/app/page.tsx`. Value is in seconds (3600 = 1 hour).

### Styling

- Global styles + Leaflet dark theme overrides: `src/app/globals.css`
- Severity colors: `SEVERITY_COLORS` in `src/lib/types.ts`
- Everything else uses Tailwind utility classes inline

## Known Issues

- **CFR RSS feed** (`cfr.org/rss.xml`) returns 404 — their feed URL may have changed. Replace or remove it in `sources.ts`.
- **Polymarket cache warning** — response exceeds Next.js 2MB cache limit. Data still works, it's just fetched fresh each time instead of cached.

## V2 Roadmap

### High Priority
- **API routes for live updates** — Add `/api/news` and `/api/polymarket` endpoints. Use client-side polling or SSE to update the dashboard without full page reloads. Currently data is only refreshed on ISR revalidation (hourly).
- **Conflict filtering & search** — Let users filter the map by severity, region, or type. Add a search bar to find conflicts by name.
- **Mobile layout improvements** — The side panel is hidden on small screens and replaced with a bottom sheet. A slide-out drawer or bottom tab navigator would work better.

### Medium Priority
- **Conflict timeline** — Show a timeline of key events for each conflict (could pull from a curated JSON or an API like ACLED).
- **More news sources** — Add Reuters, AP News, Foreign Affairs, The Economist, Defense One, etc. The more sources, the better the keyword matching coverage.
- **User-selectable notification/alerts** — Let users "watch" specific conflicts and get browser notifications when new articles match.
- **Map clustering** — When zoomed out, nearby conflicts overlap. Use marker clustering (Leaflet.markercluster) to group them.
- **Dark/light theme toggle** — Currently hardcoded dark. Adding a toggle is straightforward with Tailwind's `dark:` classes.

### Nice to Have
- **ACLED or UCDP data integration** — Pull structured conflict event data from academic APIs for casualty counts, event timelines, and geographic granularity.
- **Sentiment analysis** — Run article titles/snippets through a sentiment model to show whether coverage is escalating or de-escalating.
- **Shareable conflict views** — URL-based state (`?conflict=ukraine-russia`) so users can link directly to a specific conflict.
- **RSS source health dashboard** — Track which feeds are working vs. broken, show last-fetch timestamps.
- **PWA support** — Add a manifest and service worker so it works offline and can be installed as an app.
