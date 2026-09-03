import type { Metadata } from 'next';
import AboutPageClient from '@/app/about/AboutPageClient';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Vassili Prokopenko, a multidisciplinary product, brand, and web designer.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
