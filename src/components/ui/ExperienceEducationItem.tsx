'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/src/utils/cn';

export interface ExperienceEducationItemProps {
  /** Organization or institution name (link text) */
  title: string;
  /** Role or degree — shown after " / " in muted color */
  subtitle: string;
  /** Date or date range, e.g. "2025 - Present" or "2024 - 2027" */
  date: string;
  /** Link URL; use "#" for placeholder */
  href?: string;
  className?: string;
}

export const ExperienceEducationItem: React.FC<ExperienceEducationItemProps> = ({
  title,
  subtitle,
  date,
  href = '#',
  className,
}) => {
  return (
    <li
      className={cn(
        'flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0 py-spacing-sm border-b border-border-divider last:border-b-0',
        className
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-0 gap-y-0">
        <Link
          href={href}
          className="font-sans font-medium text-text hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-sm transition-all duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]"
        >
          {title}&nbsp;
        </Link>
        <span className="font-sans text-text-muted"> / {subtitle}</span>
      </div>
      <span className="font-sans text-text-subtle shrink-0">{date}</span>
    </li>
  );
};
