'use client';

import React from 'react';
import Image from 'next/image';
import { ExperienceEducationItem } from '@/src/components/ui/ExperienceEducationItem';

const EXPERIENCES = [
  { title: 'USThing', subtitle: 'Product Designer', date: '2025 - Present', href: 'https://usthing.xyz' },
  { title: 'MCSS', subtitle: 'Designer', date: '2024 - Present', href: 'https://www.mcss.ca/' },
  { title: 'MUS', subtitle: 'Web Designer', date: '2026', href: 'https://www.musmcgill.com/' },
  { title: 'Lyft', subtitle: 'UX Research Intern • McGill MicroEXP', date: '2025', href: 'https://lyfturbansolutions.com/' }
];

const EDUCATION = [
  { title: 'McGill', subtitle: 'BCom', date: '2024 - 2027', href: 'https://www.mcgill.ca/' },
  { title: 'HKUST', subtitle: 'Exchange', date: '2025 - 2026', href: 'https://hkust.edu.hk/' },
  { title: 'DFSG', subtitle: 'HCD x AI Program', date: '2026', href: 'https://www.studio-school.com/' },
];

export const AboutSection: React.FC = () => {
  return (
    <section
      className="w-full py-12 md:py-20 bg-background"
      aria-labelledby="about-heading"
      id="about"
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <h2
          id="about-heading"
          className="text-text font-sans font-medium text-2xl md:text-3xl mb-8 md:mb-10"
        >
          About
        </h2>

        {/* Main profile block: image */}
        <div className="flex flex-col gap-4">
        
        <div className="flex flex-col lg:flex-row gap-4 overflow-hidden">
          <div className="relative w-full lg:w-[40%] lg:max-w-[360px] shrink-0 aspect-[1/1] lg:min-h-[320px] rounded-lg overflow-hidden">
            <img
              src="/images/optimized/ui/about.webp"
              alt="Vassili Prokopenko"
              className="w-full h-full object-cover"
              srcSet="
                /images/optimized/ui/about.webp 1600w,
              "
              sizes="(max-width: 1023px) min(calc(100vw - 2.5rem), 1160px), 720px"
              loading="eager"
            />
          </div>
          <div className="flex flex-col rounded-lg bg-surface-1 px-sm py-md flex-1 bg-[url('/images/optimized/ui/about-sky.webp')] bg-cover bg-center bg-no-repeat bg-blend-soft-light">
            <h3 className="text-text font-sans font-medium text-xl md:text-2xl mb-4">
              Vassili Prokopenko
            </h3>
            <p className="text-text-subtle font-sans text-base leading-relaxed mb-4">
              I&apos;m a multidisciplinary designer and business analytics student at McGill,
              currently on exchange at HKUST.
            </p>
            <p className="text-text-subtle font-sans text-base leading-relaxed">
              I believe the future belongs to designers who build.
            </p>
          </div>
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-4 rounded-lg bg-surface-1">
          <div className="px-sm py-md">
            <h3 className="text-text font-sans font-medium text-lg md:text-xl mb-4">
              Experience
            </h3>
            <ul className="list-none p-0 m-0 border-border-divider">
              {EXPERIENCES.map((item) => (
                <ExperienceEducationItem
                  key={`${item.title}-${item.subtitle}-${item.date}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  date={item.date}
                  href={item.href}
                />
              ))}
            </ul>
          </div>

          {/* Education */}
          <div className="px-sm py-md">
            <h3 className="text-text font-sans font-medium text-lg md:text-xl mb-4">
              Education
            </h3>
            <ul className="list-none p-0 m-0 border-border-divider">
              {EDUCATION.map((item) => (
                <ExperienceEducationItem
                  key={`${item.title}-${item.subtitle}-${item.date}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  date={item.date}
                  href={item.href}
                />
              ))}
            </ul>
          </div>
        </div>

        </div>
      </div>
    </section>
  );
};
