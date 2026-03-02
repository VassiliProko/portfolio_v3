'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/src/utils/cn';

export interface CaseStudyHeaderProps {
  /** Project or case study title */
  title: string;
  /** Link for the back / home button (default: /) */
  backHref?: string;
  /** Accessible label for the back button */
  backLabel?: string;
  className?: string;
}

export const CaseStudyHeader: React.FC<CaseStudyHeaderProps> = ({
  title,
  backHref = '/',
  backLabel = 'Back to home',
  className,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full max-w-[1200px] mx-auto overflow-hidden px-5 py-3',
        className
      )}
      aria-label="Case study navigation"
    >
      <div className=" rounded-lg bg-surface-dark-1 w-fit px-3 py-3 flex flex-wrap items-center justify-start gap-6 w-fit">
        <Link
          href={backHref}
          className={cn(
            'font-mono inline-flex items-center justify-center py-1 px-2 rounded-md',
            'bg-surface-dark-2 text-text-inverted-1',
            'hover:bg-white/20 transition-colors duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
            'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
          )}
          aria-label={backLabel}
        >
          Home
        </Link>
        <h1 className="font-mono text-base text-text-inverted-1 leading-normal">
          {title}
        </h1>
      </div>
    </header>
  );
};
