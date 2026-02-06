import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cerebro | Real-Time Intelligence Dashboard',
  description:
    'Interactive world map of global conflicts with multi-category news intelligence feeds. Track active conflicts, world news, financial markets, tech developments, and prediction markets.',
  openGraph: {
    title: 'Cerebro',
    description:
      'Real-time interactive dashboard tracking global conflicts and intelligence feeds.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cerebro',
    description:
      'Real-time interactive dashboard tracking global conflicts and intelligence feeds.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-950 font-sans text-gray-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
