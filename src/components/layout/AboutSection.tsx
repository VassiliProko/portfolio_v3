'use client';

import React from 'react';
import { ExperienceEducationItem } from '@/src/components/ui/ExperienceEducationItem';
import { HoverSurface } from '@/src/components/ui/HoverMetaPill';
import {
  POPDOWN_REVEAL_STAGGER_MS,
  PopdownReveal,
  useMountPopdownReveal,
} from '@/src/components/ui/PopdownReveal';

const ABOUT_PROFILE_HOVER_TITLE = 'maybe munching on digestive cookies';

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

const EXPERIENCE_BASE_DELAY_MS = POPDOWN_REVEAL_STAGGER_MS * 3;
const EDUCATION_BASE_DELAY_MS =
  EXPERIENCE_BASE_DELAY_MS + POPDOWN_REVEAL_STAGGER_MS * (EXPERIENCES.length + 1);

export const AboutSection: React.FC = () => {
  const revealed = useMountPopdownReveal();

  return (
    <section
      className="w-full py-12 md:py-20"
      aria-labelledby="about-heading"
      id="about"
    >
      <PopdownReveal reveal={revealed} delayMs={0}>
        <h2
          id="about-heading"
          className="text-text font-sans font-medium text-2xl md:text-3xl mb-8 md:mb-10"
        >
          About
        </h2>
      </PopdownReveal>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 overflow-hidden">
          <PopdownReveal
            reveal={revealed}
            delayMs={POPDOWN_REVEAL_STAGGER_MS}
            className="relative w-full lg:w-[40%] lg:max-w-[360px] shrink-0 aspect-[1/1] lg:min-h-[320px] rounded-lg overflow-hidden"
          >
            <HoverSurface className="h-full w-full" hoverTitle={ABOUT_PROFILE_HOVER_TITLE}>
              <img
                src="/images/optimized/home/about.webp"
                alt="Vassili Prokopenko"
                className="h-full w-full object-cover"
                srcSet="
                  /images/optimized/home/about.webp 1600w,
                "
                sizes="(max-width: 1023px) min(calc(100vw - 2.5rem), 1160px), 720px"
                loading="eager"
              />
            </HoverSurface>
          </PopdownReveal>

          <PopdownReveal
            reveal={revealed}
            delayMs={POPDOWN_REVEAL_STAGGER_MS * 2}
            className="flex flex-col rounded-lg bg-surface-1 px-sm py-md flex-1 bg-[url('/images/optimized/home/about-sky.webp')] bg-cover bg-center bg-no-repeat bg-blend-soft-light"
          >
            <p className="text-text-subtle font-sans text-base leading-relaxed mb-4">
              Hey, I&apos;m Vassili — meaning &quot;king&quot; in Greek. I&apos;m a multidisciplinary designer and business analytics student at McGill, currently on exchange at HKUST. I&apos;m somewhere experimenting between design, code, and data-driven thinking, blending different mediums to bring anew to the world. I believe the future belongs to designers who build and understand technological craftsmanship.
            </p>
            <p className="text-text-subtle font-sans text-base leading-relaxed">
              It&apos;s a wonderful time to be alive.
            </p>
          </PopdownReveal>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-surface-1">
          <div className="px-sm py-md">
            <PopdownReveal reveal={revealed} delayMs={EXPERIENCE_BASE_DELAY_MS}>
              <h3 className="text-text font-sans font-medium text-lg md:text-xl mb-4">
                Experience
              </h3>
            </PopdownReveal>
            <ul className="list-none p-0 m-0 border-border-divider">
              {EXPERIENCES.map((item, index) => (
                <ExperienceEducationItem
                  key={`${item.title}-${item.subtitle}-${item.date}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  date={item.date}
                  href={item.href}
                  imageSrc={item.imageSrc}
                  tone="experience"
                  reveal={revealed}
                  revealDelayMs={EXPERIENCE_BASE_DELAY_MS + POPDOWN_REVEAL_STAGGER_MS * (index + 1)}
                />
              ))}
            </ul>
          </div>

          <div className="px-sm py-md">
            <PopdownReveal reveal={revealed} delayMs={EDUCATION_BASE_DELAY_MS}>
              <h3 className="text-text font-sans font-medium text-lg md:text-xl mb-4">
                Education
              </h3>
            </PopdownReveal>
            <ul className="list-none p-0 m-0 border-border-divider">
              {EDUCATION.map((item, index) => (
                <ExperienceEducationItem
                  key={`${item.title}-${item.subtitle}-${item.date}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  date={item.date}
                  href={item.href}
                  imageSrc={item.imageSrc}
                  tone="education"
                  reveal={revealed}
                  revealDelayMs={EDUCATION_BASE_DELAY_MS + POPDOWN_REVEAL_STAGGER_MS * (index + 1)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
