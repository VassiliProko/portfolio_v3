import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Oxygen_Mono } from 'next/font/google';
import '@/src/styles/globals.css';
import { ConditionalHeader } from '@/src/components/layout/ConditionalHeader';
import { Footer } from '@/src/components/layout/Footer';



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

export const metadata: Metadata = {
  title: 'Vassili Prokopenko',
  description: 'A designer crafting delightful experiences for social good.',
  openGraph: {
    title: 'Vassili Prokopenko',
    description: 'A designer crafting delightful experiences for social good.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vassili Prokopenko',
    description: 'A designer crafting delightful experiences for social good.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${satoshiVariable.variable} ${oxygenMono.variable}`}>
      <body>
        <ConditionalHeader />
        <main>{children}</main>
        <Footer />

      </body>
    </html>
  );
}
