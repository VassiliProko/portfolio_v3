'use client';

import React from 'react';
import Image from 'next/image';
import { CaseStudyHeader } from '@/src/components/layout/CaseStudyHeader';
import { cn } from '@/src/utils/cn';

export interface CaseStudyLayoutProps {
  /** Project or case study title (used in header) */
  title: string;
  /** Optional hero image src (displayed full-width below header) */
  heroImageSrc?: string;
  /** Hero image alt text */
  heroImageAlt?: string;
  /** Overview content (text or custom React node) */
  overview: React.ReactNode;
  /** Optional meta: time, role, tools, skills (displayed in right column) */
  meta?: {
    time?: string;
    role?: string;
    tools?: string;
    skills?: string;
  };
  /** Optional "View website" link (external) */
  websiteUrl?: string;
  /** Custom label for website link (default: "View website") */
  websiteLabel?: string;
  /** Optional "View GitHub" link (external) */
  githubUrl?: string;
  /** Rest of the case study (images, sections, etc.) */
  children?: React.ReactNode;
  /** Optional back link (default: /) */
  backHref?: string;
  className?: string;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0">
      <span className="font-bold text-text">{label}</span>
      <span className="text-text">{value}</span>
    </div>
  );
}

const caseStudyLinkClass =
  'py-1.5 text-text text-base font-mono leading-tight hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200';

export const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({
  title,
  heroImageSrc,
  heroImageAlt = '',
  overview,
  meta,
  websiteUrl,
  websiteLabel = 'View website',
  githubUrl,
  children,
  backHref = '/',
  className,
}) => {
  const hasMeta = meta && (meta.time ?? meta.role ?? meta.tools ?? meta.skills);
  return (
    <article
      className={cn('min-h-screen bg-background', className)}
      aria-label={`Case study: ${title}`}
    >
      <CaseStudyHeader title={title} backHref={backHref} />

      {heroImageSrc && (
        <div className="w-full max-w-[1200px] mx-auto px-5 pt-6 animate-fade-in-up-fast">
          <div className="relative w-full aspect-[4/3] md:aspect-video rounded-[8px] overflow-hidden bg-surface-2">
          <img
            src={heroImageSrc}
            alt={heroImageAlt}
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-5 py-8 md:py-10">
        <section
          className="flex flex-col md:flex-row md:gap-12 lg:gap-16 max-w-none font-sans text-md md:text-lg leading-relaxed"
          aria-labelledby="overview-heading"
        >
          <div className="flex-1 min-w-0">
            <h2 id="overview-heading" className="text-xl md:text-2xl font-bold text-text mb-4">
              Overview
            </h2>
            <div className="text-text-subtle">{overview}</div>
            {(websiteUrl ?? githubUrl) && (
              <div className="flex flex-col flex-wrap gap-x-4 gap-y-1 mt-4 w-fit">
                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={caseStudyLinkClass}
                  >
                    {websiteLabel}
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={caseStudyLinkClass}
                  >
                    view github
                  </a>
                )}
              </div>
            )}
          </div>
          {hasMeta && (
            <div className="flex flex-1 flex-col gap-6 md:gap-8 mt-8 md:mt-0 min-w-0">
              {meta.time != null && meta.time !== '' && (
                <MetaRow label="Time" value={meta.time} />
              )}
              {meta.role != null && meta.role !== '' && (
                <MetaRow label="Role" value={meta.role} />
              )}
              {meta.tools != null && meta.tools !== '' && (
                <MetaRow label="Tools" value={meta.tools} />
              )}
              {meta.skills != null && meta.skills !== '' && (
                <MetaRow label="Skills" value={meta.skills} />
              )}
            </div>
          )}
        </section>

        {children && (
          <div className="mt-10 md:mt-12 flex flex-col gap-4 md:gap-8">
            {children}
          </div>
        )}
      </div>
    </article>
  );
};
