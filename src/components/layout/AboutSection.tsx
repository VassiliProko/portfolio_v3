'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { ScrollPopdownReveal } from '@/src/components/ui/PopdownReveal';
import {
  ImagePreview,
  IMAGE_PREVIEW_TRIGGER_MEDIA_CLASS,
  type ImagePreviewItem,
} from '@/src/components/ui/ImagePreview';

const ABOUT_HERO_IMAGE = '/images/optimized/about/about.jpg';
const RESUME_PDF_HREF =
  'https://docs.google.com/document/d/1W0-QIjajoPcEnDEO99qnTczTWo3l3Wu7W1VPZ29Igfw/edit?usp=sharing';

const ABOUT_SECTION_HEADING_CLASS = 'type-label text-text-subtle';

const resumeButtonClass = cn(
  'group type-paragraph-mono inline-flex items-center h-12 px-4 rounded-sm',
  'bg-footer-contact-bg text-footer-console-text',
  'hover:bg-footer-contact-bg-hover transition-colors duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
);

const resumeButtonIconSlotClass = cn(
  'inline-flex overflow-hidden max-w-0',
  'transition-[max-width,margin-left] duration-[180ms] ease-move motion-reduce:transition-none',
  'group-hover:ml-2xs group-hover:max-w-5',
  'group-focus-visible:ml-2xs group-focus-visible:max-w-5',
  'motion-reduce:ml-2xs motion-reduce:max-w-5',
);

const resumeButtonIconClass = cn(
  'size-5 shrink-0 -translate-x-full scale-95 opacity-0',
  'transition-[transform_180ms_cubic-bezier(0.4,0,0.2,1)_0ms,opacity_120ms_cubic-bezier(0.4,0,0.2,1)_0ms]',
  'motion-reduce:transition-none',
  'group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100',
  'group-hover:transition-[transform_180ms_cubic-bezier(0.4,0,0.2,1)_0ms,opacity_120ms_cubic-bezier(0.4,0,0.2,1)_90ms]',
  'group-focus-visible:translate-x-0 group-focus-visible:scale-100 group-focus-visible:opacity-100',
  'group-focus-visible:transition-[transform_180ms_cubic-bezier(0.4,0,0.2,1)_0ms,opacity_120ms_cubic-bezier(0.4,0,0.2,1)_90ms]',
  'motion-reduce:translate-x-0 motion-reduce:scale-100 motion-reduce:opacity-100',
);

/**
 * About page gallery lightbox items — edit name / description here.
 * Gallery lightbox items for the about page.
 */
const SHOWCASE_IMAGES: ImagePreviewItem[] = [
  {
    src: '/images/optimized/about/dojo.jpg',
    name: 'Dojo Life',
    description:
      'General Learning Malaysia Offsite',
    width: 992,
    height: 592,
    captionTone: 'on-dark',
  },
  {
    src: '/images/optimized/about/usthing.jpg',
    name: 'USThing',
    description:
      'USThing team photo after eating McDonalds',
    width: 992,
    height: 592,
    captionTone: 'on-dark',
  },
  {
    src: '/images/optimized/about/hk.jpg',
    name: 'Hong Kong',
    description:
      'Spent an incredible year studying in Hong Kong',
    width: 992,
    height: 592,
    captionTone: 'on-dark',
  },
  {
    src: '/images/optimized/about/mcss.jpg',
    name: 'MCSS',
    description:
      "A super cool uni society I've been a part of",
    width: 992,
    height: 592,
    captionTone: 'on-dark',
  },
  {
    src: '/images/optimized/about/dragonboat.jpg',
    name: 'Dragon Boat',
    description:
      'Hong Kong International Dragon Boat Festival',
    width: 992,
    height: 592,
    captionTone: 'on-dark',
  },
  {
    src: '/images/optimized/about/mcgill.jpg',
    name: 'McGill',
    description:
      'McGill campus in the fall, pretty indeed',
    width: 992,
    height: 592,
    captionTone: 'on-dark',
  },
];

interface AboutRoleEntry {
  title: string;
  subtitle: string;
  date: string;
  href: string;
  imageSrc: string;
}

const EXPERIENCES: AboutRoleEntry[] = [
  {
    title: 'General Learning',
    subtitle: 'Product Design Intern',
    date: 'Summer 2026',
    href: 'https://www.generallearning.com/',
    imageSrc: '/images/optimized/about/experience-general-learning.png',
  },
  {
    title: 'DSFG',
    subtitle: 'Product Design Fellow',
    date: 'Spring 2026',
    href: 'https://www.studio-school.com/',
    imageSrc: '/images/optimized/about/experience-dfsg.png',
  },
  {
    title: 'Lyft',
    subtitle: 'UX Research Intern • McGill MicroEXP Program',
    date: 'May 2025',
    href: 'https://lyfturbansolutions.com/',
    imageSrc: '/images/optimized/about/experience-lyft.png',
  },
];

const COMMUNITY_ROLES: AboutRoleEntry[] = [
  {
    title: 'MCSS',
    subtitle: 'Graphic & Web Designer',
    date: 'Fall 2024 - Present',
    href: 'https://www.mcss.ca/',
    imageSrc: '/images/optimized/about/community-mcss.png',
  },
  {
    title: 'USThing',
    subtitle: 'Product Designer',
    date: 'Fall 2025 - Spring 2026',
    href: 'https://usthing.xyz',
    imageSrc: '/images/optimized/about/community-usthing.png',
  },
];

type AboutRoleRowProps = AboutRoleEntry;

const AboutRoleRow: React.FC<AboutRoleRowProps> = ({
  title,
  subtitle,
  date,
  href,
  imageSrc,
}) => {
  return (
    <div className="flex w-full items-start gap-about-role-icon">
      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface-2">
        <Image src={imageSrc} alt="" fill className="object-cover" sizes="44px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center justify-between gap-sm">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="type-paragraph text-text hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-sm transition-all duration-[60ms] ease-snap"
          >
            {title}
          </a>
          <span className="type-paragraph shrink-0 text-text-muted">{date}</span>
        </div>
        <span className="type-paragraph text-text-subtle">{subtitle}</span>
      </div>
    </div>
  );
};

type AboutRoleListProps = {
  heading: string;
  items: AboutRoleEntry[];
};

const AboutRoleList: React.FC<AboutRoleListProps> = ({ heading, items }) => {
  return (
    <div className="flex flex-col gap-about-role-section">
      <h3 className={ABOUT_SECTION_HEADING_CLASS}>{heading}</h3>
      <div className="flex flex-col gap-md">
        {items.map((item) => (
          <AboutRoleRow key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};

export const AboutSection: React.FC = () => {
  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null);

  return (
    <section
      className="w-full py-12 md:py-20"
      aria-labelledby="about-heading"
      id="about"
    >
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-xl md:gap-2xl">
        <ScrollPopdownReveal delayMs={0}>
          <div className="relative aspect-[760/456] w-full overflow-hidden rounded-sm bg-surface-2">
            <Image
              src={ABOUT_HERO_IMAGE}
              alt="Vassili Prokopenko"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 760px"
              priority
            />
          </div>
        </ScrollPopdownReveal>

        <ScrollPopdownReveal delayMs={0}>
          <div className="flex flex-col gap-lg">
            <h2 id="about-heading" className={ABOUT_SECTION_HEADING_CLASS}>
              About
            </h2>
            <div className="max-w-[672px]">
              <p className="type-paragraph mb-0">
                I&apos;m a multidisciplinary designer and business analytics student at McGill
                University in Montreal.
              </p>
              <p className="type-paragraph mb-0">&nbsp;</p>
              <p className="type-paragraph mb-0">
                I design for a more curious, healthier, and prettier world. A place where people
                feel that they belong and are loved. By bringing a deep level of care and thought, I
                believe that we can design a wonderful future.
              </p>
              <p className="type-paragraph mb-0">&nbsp;</p>
              <p className="type-paragraph mb-0">I also enjoy crispy tofu and dragon boat.</p>
            </div>
          </div>
        </ScrollPopdownReveal>

        <ScrollPopdownReveal delayMs={0} className="grid grid-cols-2 gap-2xs md:grid-cols-3">
          {SHOWCASE_IMAGES.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setPreviewIndex(index)}
              aria-label={`Open ${image.name} image preview`}
              className={cn(
                'group relative aspect-[335/200] cursor-zoom-in overflow-hidden rounded-sm border-0 bg-surface-2 p-0',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
              )}
            >
              <Image
                src={image.src}
                alt={image.alt ?? image.description ?? image.name}
                fill
                className={cn(
                  'pointer-events-none object-cover',
                  IMAGE_PREVIEW_TRIGGER_MEDIA_CLASS,
                )}
                sizes="(max-width: 768px) 50vw, 245px"
              />
            </button>
          ))}
        </ScrollPopdownReveal>

        <ScrollPopdownReveal delayMs={0}>
          <AboutRoleList heading="Experience" items={EXPERIENCES} />
        </ScrollPopdownReveal>

        <ScrollPopdownReveal delayMs={0}>
          <AboutRoleList heading="Community" items={COMMUNITY_ROLES} />
        </ScrollPopdownReveal>

        <ScrollPopdownReveal delayMs={0}>
          <a
            href={RESUME_PDF_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={resumeButtonClass}
            aria-label="Open PDF resume in a new tab"
          >
            PDF Resume
            <span className={resumeButtonIconSlotClass} aria-hidden>
              <ArrowUpRight className={resumeButtonIconClass} strokeWidth={2} />
            </span>
          </a>
        </ScrollPopdownReveal>
      </div>

      <ImagePreview
        items={SHOWCASE_IMAGES}
        activeIndex={previewIndex ?? 0}
        onActiveIndexChange={setPreviewIndex}
        open={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
      />
    </section>
  );
};
