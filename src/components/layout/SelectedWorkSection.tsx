'use client';

import React from 'react';
import { CaseStudyCard } from '@/src/components/ui/CaseStudyCard';

const CASE_STUDIES = [
  {
    title: "McGill Chinese Students' Society",
    duration: '2025',
    description:
      "Exploring how Chinese + society culture could be captured in an intuitive, mobile-responsive website",
    gradient: 'primary' as const,
    href: '/mcss',
  },
  {
    title: 'Prettify Minerva',
    duration: '2025',
    description:
      "Improving the appearance of Minerva, McGill's central university portal",
    gradient: 'dark' as const,
    href: '/prettify-minerva',
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
              href={study.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
