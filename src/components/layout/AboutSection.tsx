'use client';

import React from 'react';
import Image from 'next/image';
import { ExperienceEducationItem } from '@/src/components/ui/ExperienceEducationItem';

interface ExperienceEducationEntry {
  title: string;
  subtitle: string;
  date: string;
  href: string;
  imageSrc?: string;
}

const EXPERIENCES: ExperienceEducationEntry[] = [
  { title: 'RevisionDojo', subtitle: 'Product Design Intern', date: '2026 - Present', href: 'https://www.revisiondojo.com/', imageSrc: '/images/optimized/home/revisiondojo.webp' },
  { title: 'MCSS', subtitle: 'Designer', date: '2024 - Present', href: 'https://www.mcss.ca/', imageSrc: '/images/optimized/home/mcss.webp' },
  { title: 'USThing', subtitle: 'Product Designer', date: '2025 - 2026', href: 'https://usthing.xyz', imageSrc: '/images/optimized/home/usthing.webp' },
  { title: 'DFSG', subtitle: 'Design Fellow', date: '2026', href: 'https://www.studio-school.com/', imageSrc: '/images/optimized/home/DFSG.webp' },
  { title: 'Lyft', subtitle: 'UX Research Intern • MicroEXP', date: '2025', href: 'https://lyfturbansolutions.com/', imageSrc: '/images/optimized/home/lyft.webp' }
];

const EDUCATION: ExperienceEducationEntry[] = [
  { title: 'McGill', subtitle: 'BCom', date: '2024 - 2027', href: 'https://www.mcgill.ca/', imageSrc: '/images/optimized/home/mcgill.webp' },
  { title: 'HKUST', subtitle: 'Exchange', date: '2025 - 2026', href: 'https://hkust.edu.hk/', imageSrc: '/images/optimized/home/hkust.webp' },
];

export const AboutSection: React.FC = () => {
  return (
    <section
      className="w-full py-12 md:py-20 bg-background animate-fade-in-up-fast"
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
            
          <div className="rounded-lg border-none bg-surface-dark-1 text-text-inverted-1 absolute bottom-0 left-0 right-0 mx-xs my-xs">
            <div className="mx-auto px-3 py-3">
              <div className="flex flex-row justify-between gap-4">
                <div className="px-2 py-1 rounded-sm bg-primary-darker text-sm font-mono text-text-primary">
                  Name:
                </div>
                <div className="px-2 py-1 rounded-sm text-sm font-mono">
                  Vassili Prokopenko
                </div>
              </div>
            </div>
          </div>
            
            <img
              src="/images/optimized/home/about.webp"
              alt="Vassili Prokopenko"
              className="w-full h-full object-cover"
              srcSet="
                /images/optimized/home/about.webp 1600w,
              "
              sizes="(max-width: 1023px) min(calc(100vw - 2.5rem), 1160px), 720px"
              loading="eager"
            />
          </div>
          <div className="flex flex-col rounded-lg bg-surface-1 px-sm py-md flex-1 bg-[url('/images/optimized/home/about-sky.webp')] bg-cover bg-center bg-no-repeat bg-blend-soft-light">
            <p className="text-text-subtle font-sans text-base leading-relaxed mb-4">
            Hey, I’m Vassili — meaning “king” in Greek. I’m a multidisciplinary designer and business analytics student at McGill, currently on exchange at HKUST. I'm somewhere experimenting between design, code, and data-driven thinking, blending different mediums to bring anew to the world. I believe the future belongs to designers who build and understand technological craftsmanship.
            </p>
            <p className="text-text-subtle font-sans text-base leading-relaxed">
              It’s a wonderful time to be alive.
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
                  imageSrc={item.imageSrc}
                  tone="experience"
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
                  imageSrc={item.imageSrc}
                  tone="education"
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
