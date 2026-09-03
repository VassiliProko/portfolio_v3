import type { Metadata } from 'next';
import HomePageClient from '@/app/HomePageClient';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
