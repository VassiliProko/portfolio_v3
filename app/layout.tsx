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
      </body>
    </html>
  );
}
