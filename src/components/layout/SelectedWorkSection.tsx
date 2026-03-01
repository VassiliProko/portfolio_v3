'use client';

import React from 'react';
import { CaseStudyCard } from '@/src/components/ui/CaseStudyCard';

const CASE_STUDIES = [
  {
    title: "McGill Chinese Students' Society",
    duration: '2025 - 2026',
    description:
      "Exploring how Chinese + society culture could be captured in an intuitive, mobile-responsive website",
    gradient: 'primary' as const,
    href: '/work/mcss',
  },
  {
    title: 'Prettify Minerva',
    duration: '2025',
    description:
      "Improving the appearance of Minerva, McGill's central university portal",
    gradient: 'dark' as const,
    href: '/work/prettify-minerva',
  },
];

export const SelectedWorkSection: React.FC = () => {
  return (
    <section className="w-full bg-background" aria-labelledby="selected-work-heading">
      <div className="max-w-[1200px] mx-auto px-5">
        <h2
          id="selected-work-heading"
          className="text-text font-sans font-medium text-2xl md:text-3xl mb-8 md:mb-10"
        >
          Selected Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[15px]">
          {CASE_STUDIES.map((study) => (
            <CaseStudyCard
              key={study.title}
              title={study.title}
              duration={study.duration}
              description={study.description}
              gradient={study.gradient}
              href={study.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
