'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/src/utils/cn';

export type CaseStudyCardGradient =
  | 'primary'   // primary-darker → primary-base
  | 'dark';     // surface-dark-1 → surface-dark-2

export interface CaseStudyCardProps {
  /** Project or case study title */
  title: string;
  /** Duration or year range, e.g. "2025" or "2025 - 2026" */
  duration: string;
  /** Short description of the project */
  description: string;
  /** Gradient style for the placeholder visual area */
  gradient?: CaseStudyCardGradient;
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
};

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  title,
  duration,
  description,
  gradient = 'primary',
  href,
  className,
}) => {
  const content = (
    <>
      {/* Placeholder gradient area — no image */}
      <div
        className="w-full aspect-[4/3] shrink-0 rounded-lg"
        style={gradientStyles[gradient]}
        aria-hidden
      />
      <div className="p-[15px] flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0">
          <h3 className="text-text font-sans font-medium text-lg leading-tight">
            {title}
          </h3>
          <span className="font-mono text-sm text-text-muted shrink-0">
            {duration}
          </span>
        </div>
        <p className="text-text-subtle font-sans text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </>
  );

  const cardClasses = cn(
    'flex flex-col overflow-hidden bg-background',
    'transition-all duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
    href && 'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-outline',
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
