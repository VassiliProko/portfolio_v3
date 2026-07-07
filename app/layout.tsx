import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Oxygen_Mono, Satisfy } from 'next/font/google';
import '@/src/styles/globals.css';
import { ConditionalNav } from '@/src/components/layout/ConditionalNav';
import { Footer } from '@/src/components/layout/Footer';
import { FooterLastUpdated } from '@/src/components/layout/FooterLastUpdated';
import { MainContentShell } from '@/src/components/layout/MainContentShell';
import { ThemeScript } from '@/src/components/ThemeScript';
import { HomeEnterAnimationProvider } from '@/src/contexts/HomeEnterAnimationContext';
import { Analytics } from "@vercel/analytics/next"


const satoshiVariable = localFont({
  src: '../public/fonts/Satoshi-Variable.ttf',
  variable: '--font-satoshi',
  display: 'swap',
  weight: '100 900',
  fallback: ['system-ui', 'sans-serif'],
});

const oxygenMono = Oxygen_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-oxygen-mono',
  display: 'swap',
});

const satisfy = Satisfy({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-satisfy',
  display: 'swap',
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
    <html lang="en" className={`${satoshiVariable.variable} ${oxygenMono.variable} ${satisfy.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <HomeEnterAnimationProvider>
          <ConditionalNav />
          <MainContentShell>
            {children}
            <Footer lastUpdated={<FooterLastUpdated />} />
          </MainContentShell>
        </HomeEnterAnimationProvider>
        <Analytics />
      </body>
    </html>
  );
}
