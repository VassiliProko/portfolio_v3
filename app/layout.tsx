import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/src/styles/globals.css';
import { ConditionalNav } from '@/src/components/layout/ConditionalNav';
import { Footer } from '@/src/components/layout/Footer';
import { FooterLastUpdated } from '@/src/components/layout/FooterLastUpdated';
import { MainContentShell } from '@/src/components/layout/MainContentShell';
import { ThemeProvider } from '@/src/components/ThemeProvider';
import { ThemeScript } from '@/src/components/ThemeScript';
import { HomeEnterAnimationProvider } from '@/src/contexts/HomeEnterAnimationContext';
import { Analytics } from "@vercel/analytics/next";
import { PostHogInit } from '@/src/components/PostHogInit';
import { JsonLd } from '@/src/components/JsonLd';
import { getLastUpdatedIso } from '@/src/utils/get-last-updated-iso';

const SITE_URL = 'https://www.vassiliprokopenko.com';
const LAST_MODIFIED = getLastUpdatedIso();

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Vassili Prokopenko',
      url: SITE_URL,
      image: `${SITE_URL}/images/optimized/about/about.jpg`,
      jobTitle: 'Multidisciplinary Product, Brand, and Web Designer',
      description:
        'Multidisciplinary designer and Business Analytics student at McGill University creating digital products, visual systems, and web experiences.',
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'McGill University',
      },
      worksFor: {
        '@type': 'Organization',
        name: 'General Learning',
      },
      sameAs: ['https://www.linkedin.com/in/vassili-prokopenko'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Vassili Prokopenko',
      description: 'Portfolio of Vassili Prokopenko, a multidisciplinary product, brand, and web designer.',
      publisher: { '@id': `${SITE_URL}/#person` },
      dateModified: LAST_MODIFIED,
    },
  ],
};

const satoshiVariable = localFont({
  src: '../public/fonts/Satoshi-Variable.ttf',
  variable: '--font-satoshi',
  display: 'swap',
  weight: '100 900',
  fallback: ['system-ui', 'sans-serif'],
});

/** Local files avoid next/font/google network fetches that can stall cold compiles. */
const oxygenMono = localFont({
  src: '../public/fonts/OxygenMono-Regular.woff2',
  variable: '--font-oxygen-mono',
  display: 'swap',
  weight: '400',
  fallback: ['ui-monospace', 'monospace'],
});

const satisfy = localFont({
  src: '../public/fonts/Satisfy-Regular.woff2',
  variable: '--font-satisfy',
  display: 'swap',
  weight: '400',
  fallback: ['cursive'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Vassili Prokopenko',
  description: 'a young lad busy munching & cooking delightful creations',
  openGraph: {
    title: 'Vassili Prokopenko',
    description: 'a young lad busy munching & cooking delightful creations',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vassili Prokopenko',
    description: 'a young lad busy munching & cooking delightful creations',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <JsonLd data={siteJsonLd} />
      </head>
      <body
        className={`${satoshiVariable.variable} ${oxygenMono.variable} ${satisfy.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <HomeEnterAnimationProvider>
            <ConditionalNav />
            <MainContentShell>
              {children}
              <Footer lastUpdated={<FooterLastUpdated />} />
            </MainContentShell>
          </HomeEnterAnimationProvider>
        </ThemeProvider>
        <Analytics />
        <PostHogInit />
      </body>
    </html>
  );
}
