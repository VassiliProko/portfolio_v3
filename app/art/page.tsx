'use client';

import React from 'react';
import { ArtGallery } from '@/src/components/ui/ArtGallery';
import type { ArtGalleryItem } from '@/src/components/ui/ArtGallery';

const ART_ITEMS: ArtGalleryItem[] = [
  {
    title: 'Membership Card',
    year: '2025',
    imageSrc: '/images/optimized/art/membership-card.webp',
    imageAlt: 'Membership card design',
  },
  {
    title: 'Volume 62, Issue 5',
    year: '2024',
    imageSrc: '/images/optimized/art/bw-graphic.webp',
    imageAlt: 'Volume 62, Issue 5 design',
  },
  {
    title: 'Terminator',
    year: '2023',
    imageSrc: '/images/optimized/art/terminator.webp',
    imageAlt: 'Terminator design',
  },
  {
    title: 'North Pole',
    year: '2023',
    imageSrc: '/images/optimized/art/north-pole.webp',
    imageAlt: 'North Pole',
  },
  {
    title: 'Crab Cave',
    year: '2025',
    imageSrc: '/images/optimized/art/Crab_Cave.webp',
    imageAlt: 'Crab Cave',
  },
  {
    title: 'Hearts in Submission',
    year: '2025',
    imageSrc: '/images/optimized/art/Heart.webp',
    imageAlt: 'Heart',
  }
];

export default function ArtPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full pt-12 md:pt-20">
        <div className="max-w-[1200px] mx-auto px-5">
        <div className="rounded-lg border-none bg-surface-dark-1 text-text-inverted-1">
          <div className="mx-auto px-3 py-3">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="px-2 py-1 rounded-sm bg-surface-dark-2 text-sm font-mono">
                Art Gallery
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
          {/* <div className="bg-surface-dark-1 rounded-lg border-none overflow-hidden mb-3 relative flex">
            <div className="p-8 md:p-12 lg:p-16">
              <h2 className="text-text-inverted-1 text-2xl md:text-3xl lg:text-4xl font-medium leading-tight">
                Art Gallery
              </h2>
            </div>
          </div>
        </div>
      </section> */}

      {/* Art Gallery — 2 columns, title + year under each (hero-stats style) */}
      <section className="w-full pb-12 md:pb-20 pt-2" aria-label="Art gallery">
        <div className="max-w-[1200px] mx-auto px-5">
          <ArtGallery items={ART_ITEMS} />
        </div>
      </section>
    </div>
  );
}
