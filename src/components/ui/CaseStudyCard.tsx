'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/src/utils/cn';

export type CaseStudyCardGradient =
  | 'primary'   // primary-darker → primary-base
  | 'dark'      // surface-dark-1 → surface-dark-2
  | 'mcss'      // MCSS red gradient (use with coverImageSrc)
  | 'prettify'; // Prettify Minerva (gray + red overlay)

export interface CaseStudyCardProps {
  /** Project or case study title */
  title: string;
  /** Duration or year range, e.g. "2025" or "2025 - 2026" */
  duration: string;
  /** Short description of the project */
  description: string;
  /** Gradient style for the placeholder visual area */
  gradient?: CaseStudyCardGradient;
  /** Optional cover image (centered with gap inside gradient area); hover scales image slightly */
  coverImageSrc?: string;
  /** When true, cover image fills entire gradient area (no padding); use for full-bleed cards */
  coverFullBleed?: boolean;
  /** Optional link to full case study page */
  href?: string;
  className?: string;
}

const gradientStyles: Record<CaseStudyCardGradient, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(180deg, var(--color-primary-lighter) 0%, var(--color-primary-base) 100%)',
  },
  dark: {
    background: 'linear-gradient(180deg, var(--color-surface-dark-1) 0%, var(--color-surface-dark-2) 100%)',
  },
  mcss: {
    background: 'var(--gradient-mcss)',
  },
  prettify: {
    background: 'var(--gradient-prettify-minerva)',
  },
};

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  title,
  duration,
  description,
  gradient = 'primary',
  coverImageSrc,
  coverFullBleed = false,
  href,
  className,
}) => {
  const hasCoverImage = Boolean(coverImageSrc);

  const content = (
    <>
      {/* Gradient area: with optional cover image; full-bleed or centered with gap; image scales on hover */}
      <div
        className={cn(
          'w-full aspect-[4/3] shrink-0 rounded-[8px] overflow-hidden relative',
          hasCoverImage && !coverFullBleed && 'p-8 flex items-center justify-center'
        )}
        style={gradientStyles[gradient]}
        aria-hidden
      >
        {hasCoverImage && coverImageSrc && (
          <div
            className={cn(
              'overflow-hidden transition-transform duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)] group-hover:scale-105',
              coverFullBleed ? 'absolute inset-0' : 'w-full rounded-[4px]'
            )}
          >
            <Image
              src={coverImageSrc}
              alt=""
              fill={coverFullBleed}
              width={coverFullBleed ? undefined : 1200}
              height={coverFullBleed ? undefined : 800}
              className={cn(
                coverFullBleed ? 'object-cover w-full h-full' : 'w-full h-auto'
              )}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="mt-xs px-sm py-xs flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0 bg-surface-1 rounded-lg">
          <h3 className="text-text font-sans font-medium text-lg leading-tight">
            {title}
          </h3>
          <span className="font-mono text-sm text-text-muted shrink-0">
            {duration}
          </span>
        </div>
        <p className="px-sm text-text-subtle font-sans text-md leading-relaxed mb-4">
          {description}
        </p>
      </div>
    </>
  );

  const cardClasses = cn(
    'group flex flex-col overflow-hidden bg-background',
    'transition-all duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
    href && 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <article className={cardClasses}>
      {content}
    </article>
  );
};
