'use client';

import React from 'react';
import { CaseStudyCard } from '@/src/components/ui/CaseStudyCard';

const CASE_STUDIES: Array<{
  title: string;
  duration: string;
  description: string;
  gradient: 'primary' | 'dark' | 'mcss' | 'prettify';
  coverImageSrc?: string;
  coverFullBleed?: boolean;
  href: string;
}> = [
  {
    title: 'Prettify Minerva',
    duration: '2025',
    description:
      "Improving the appearance of Minerva, McGill's central university portal",
    gradient: 'prettify',
    coverImageSrc: '/images/optimized/home/prettify-minerva-cover2.webp',
    href: '/prettify-minerva',
  },
  {
    title: "McGill Chinese Students' Society",
    duration: '2025',
    description:
      "I revamped the MCSS website with a cleaner layout and improved mobile navigation, making it easier for students to discover events, sponsors, and society events.",
    gradient: 'mcss',
    coverImageSrc: '/images/optimized/home/mcss-cover.webp',
    href: '/mcss',
  },
];

export const SelectedWorkSection: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-background" aria-labelledby="selected-work-heading" id="work">
      <div className="max-w-[1200px] mx-auto px-5">
        <h2
          id="selected-work-heading"
          className="text-text font-sans font-medium text-2xl md:text-3xl mb-8 md:mb-10"
        >
          Selected Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CASE_STUDIES.map((study) => (
            <CaseStudyCard
              key={study.title}
              title={study.title}
              duration={study.duration}
              description={study.description}
              gradient={study.gradient}
              coverImageSrc={study.coverImageSrc}
              coverFullBleed={study.coverFullBleed}
              href={study.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
