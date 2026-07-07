'use client';

import React from 'react';
import {
  POPDOWN_REVEAL_STAGGER_MS,
  PopdownReveal,
  ScrollPopdownReveal,
  ScrollRevealGroup,
} from '@/src/components/ui/PopdownReveal';
import { cn } from '@/src/utils/cn';

export interface CaseStudyLayoutProps {
  /** Project or case study title */
  title: string;
  /** Subtitle shown below title (home intro subtitle style) */
  subtitle?: string;
  /** Optional hero image src (displayed below title) */
  heroImageSrc?: string;
  /** Hero image alt text */
  heroImageAlt?: string;
  /** Optional local video src for hero (e.g. /other/mcss_video.webm) */
  heroVideoSrc?: string;
  /** Optional YouTube/Vimeo embed URL for hero video */
  heroVideoEmbedUrl?: string;
  /** Hero video accessible label */
  heroVideoTitle?: string;
  /** Optional style override for hero media wrapper */
  heroMediaStyle?: React.CSSProperties;
  /** Custom hero block (replaces image/video hero when set) */
  hero?: React.ReactNode;
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
  className?: string;
}

const CASE_STUDY_TITLE_CLASS =
  'font-sans text-[32px] font-medium leading-normal text-text';

const CASE_STUDY_SUBTITLE_CLASS =
  'font-sans text-xl font-medium leading-normal text-text-muted';

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

function CaseStudyHeroMedia({
  heroVideoSrc,
  heroVideoEmbedUrl,
  heroVideoTitle,
  heroImageSrc,
  heroImageAlt,
  heroMediaStyle,
}: Pick<
  CaseStudyLayoutProps,
  | 'heroVideoSrc'
  | 'heroVideoEmbedUrl'
  | 'heroVideoTitle'
  | 'heroImageSrc'
  | 'heroImageAlt'
  | 'heroMediaStyle'
>) {
  if (heroVideoSrc || heroVideoEmbedUrl) {
    return (
      <div
        className="w-full overflow-hidden rounded-[8px] bg-surface-2 p-3 md:p-5"
        style={heroMediaStyle}
      >
        <div className="w-full overflow-hidden rounded-lg">
          {heroVideoSrc ? (
            <video
              className="pointer-events-none block h-auto w-full"
              src={heroVideoSrc}
              autoPlay
              muted
              loop
              playsInline
              aria-label={heroVideoTitle}
            />
          ) : (
            <iframe
              className="case-study-yt-frame aspect-video w-full pointer-events-none"
              src={heroVideoEmbedUrl}
              title={heroVideoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      </div>
    );
  }

  if (!heroImageSrc) {
    return null;
  }

  return (
    <div
      className="w-full overflow-hidden rounded-[8px] bg-surface-2"
      style={heroMediaStyle}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroImageSrc}
        alt={heroImageAlt ?? ''}
        className="block h-auto w-full"
        sizes="100vw"
      />
    </div>
  );
}

export const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({
  title,
  subtitle,
  heroImageSrc,
  heroImageAlt = '',
  heroVideoSrc,
  heroVideoEmbedUrl,
  heroVideoTitle = 'Case study hero video',
  heroMediaStyle,
  hero,
  overview,
  meta,
  websiteUrl,
  websiteLabel = 'View website',
  githubUrl,
  children,
  className,
}) => {
  const hasMeta = meta && (meta.time ?? meta.role ?? meta.tools ?? meta.skills);
  const hasDefaultHero = Boolean(heroVideoSrc || heroVideoEmbedUrl || heroImageSrc);
  const hasHero = Boolean(hero ?? hasDefaultHero);

  const metaEntries = hasMeta
    ? ([
        meta.time ? { label: 'Time', value: meta.time } : null,
        meta.role ? { label: 'Role', value: meta.role } : null,
        meta.tools ? { label: 'Tools', value: meta.tools } : null,
        meta.skills ? { label: 'Skills', value: meta.skills } : null,
      ].filter(Boolean) as { label: string; value: string }[])
    : [];

  return (
    <article
      className={cn('min-h-screen bg-background', className)}
      aria-label={`Case study: ${title}`}
    >
      <div className="flex w-full flex-col gap-lg pt-6">
        <ScrollPopdownReveal delayMs={0}>
          <header className="flex flex-col gap-3">
            <h1 className={CASE_STUDY_TITLE_CLASS}>{title}</h1>
            {subtitle ? <p className={CASE_STUDY_SUBTITLE_CLASS}>{subtitle}</p> : null}
          </header>
        </ScrollPopdownReveal>

        {hasHero ? (
          <ScrollPopdownReveal delayMs={0}>
            {hero ?? (
              <CaseStudyHeroMedia
                heroVideoSrc={heroVideoSrc}
                heroVideoEmbedUrl={heroVideoEmbedUrl}
                heroVideoTitle={heroVideoTitle}
                heroImageSrc={heroImageSrc}
                heroImageAlt={heroImageAlt}
                heroMediaStyle={heroMediaStyle}
              />
            )}
          </ScrollPopdownReveal>
        ) : null}
      </div>

      <div className="py-8 md:py-10">
        <ScrollRevealGroup>
          {(revealed) => (
            <section
              className="flex max-w-none flex-col font-sans text-md leading-relaxed md:flex-row md:gap-12 md:text-lg lg:gap-16"
              aria-labelledby="overview-heading"
            >
              <div className="min-w-0 flex-1">
                <PopdownReveal reveal={revealed} delayMs={0}>
                  <h2 id="overview-heading" className="mb-4 text-xl font-bold text-text md:text-2xl">
                    Overview
                  </h2>
                </PopdownReveal>
                <PopdownReveal reveal={revealed} delayMs={POPDOWN_REVEAL_STAGGER_MS}>
                  <div className="text-text-subtle">{overview}</div>
                </PopdownReveal>
                {(websiteUrl ?? githubUrl) && (
                  <PopdownReveal reveal={revealed} delayMs={POPDOWN_REVEAL_STAGGER_MS * 2}>
                    <div className="mt-4 flex w-fit flex-col flex-wrap gap-x-4 gap-y-1">
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
                  </PopdownReveal>
                )}
              </div>
              {metaEntries.length > 0 && (
                <div className="mt-8 flex min-w-0 flex-1 flex-col gap-6 md:mt-0 md:gap-8">
                  {metaEntries.map((entry, index) => (
                    <PopdownReveal
                      key={entry.label}
                      reveal={revealed}
                      delayMs={POPDOWN_REVEAL_STAGGER_MS * (index + 1)}
                    >
                      <MetaRow label={entry.label} value={entry.value} />
                    </PopdownReveal>
                  ))}
                </div>
              )}
            </section>
          )}
        </ScrollRevealGroup>

        {children ? (
          <div className="mt-10 flex flex-col gap-4 md:mt-12 md:gap-8">
            {React.Children.toArray(children).map((child, index) => (
              <ScrollPopdownReveal key={index} delayMs={0}>
                {child}
              </ScrollPopdownReveal>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};
