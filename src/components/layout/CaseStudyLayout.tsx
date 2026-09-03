'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from '@phosphor-icons/react';
import {
  projectSlugFromPathname,
  sectionIdFromLabel,
  trackEvent,
} from '@/src/utils/analytics';
import { cn } from '@/src/utils/cn';
import { BackgroundSafeVideo } from '@/src/components/ui/BackgroundSafeVideo';
import {
  POPDOWN_REVEAL_STAGGER_MS,
  PopdownReveal,
  ScrollPopdownReveal,
  ScrollRevealGroup,
} from '@/src/components/ui/PopdownReveal';
import {
  CASE_STUDY_CONTENT_CLASS,
  CASE_STUDY_EXTERNAL_LINK_CLASS,
  CASE_STUDY_OVERVIEW_COLUMNS_CLASS,
} from '@/src/constants/caseStudy';

export { CASE_STUDY_BODY_CLASS } from '@/src/constants/caseStudy';

export interface CaseStudyLayoutProps {
  /** Project title — used for accessibility labeling only (not rendered in the layout) */
  title: string;
  /** Optional hero image src (first content under the navbar) */
  heroImageSrc?: string;
  /** Hero image alt text */
  heroImageAlt?: string;
  /** Intrinsic width for Next Image CLS prevention */
  heroImageWidth?: number;
  /** Intrinsic height for Next Image CLS prevention */
  heroImageHeight?: number;
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
  /** Overview paragraphs (editorial columns; stack on small viewports) */
  overview: React.ReactNode;
  /** Optional meta: duration, role, tools, skills, team (displayed under overview) */
  meta?: {
    duration?: string;
    role?: string;
    tools?: string;
    skills?: string;
    /** Supports links / multi-line team credits */
    team?: React.ReactNode;
  };
  /** Optional "View website" link (external) */
  websiteUrl?: string;
  /** Custom label for website link (default: "View website") */
  websiteLabel?: string;
  /** Optional "View GitHub" link (external) */
  githubUrl?: string;
  /** Custom label for GitHub link (default: "Github") */
  githubLabel?: string;
  /** Rest of the case study (images, sections, etc.) */
  children?: React.ReactNode;
  className?: string;
}

/** Overview field label — Role / Tools / Skills → type-label */
const META_LABEL_CLASS = 'type-label text-text-subtle';

const META_VALUE_CLASS = 'type-paragraph text-text';

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2xs pr-about-role-icon">
      <span className={META_LABEL_CLASS}>{label}</span>
      <div className={META_VALUE_CLASS}>{value}</div>
    </div>
  );
}

function findSectionLabel(node: React.ReactNode, depth = 0): string | null {
  if (depth > 2 || !React.isValidElement(node)) return null;

  const props = node.props as {
    captionLabel?: unknown;
    title?: unknown;
    'aria-label'?: unknown;
    children?: React.ReactNode;
  };

  if (typeof props.captionLabel === 'string' && props.captionLabel.trim()) {
    return props.captionLabel;
  }
  if (typeof props.title === 'string' && props.title.trim()) {
    return props.title;
  }
  if (typeof props['aria-label'] === 'string' && props['aria-label'].trim()) {
    return props['aria-label'];
  }

  return React.Children.toArray(props.children)
    .map((child) => findSectionLabel(child, depth + 1))
    .find((label): label is string => Boolean(label)) ?? null;
}

function sectionIdFromChild(child: React.ReactNode, index: number): string {
  const label = findSectionLabel(child);
  return label ? sectionIdFromLabel(label) : `section-${index + 1}`;
}

function CaseStudySectionReached({
  project,
  section,
  children,
}: {
  project: string;
  section: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        trackEvent('case_study_section_reached', { project, section });
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [project, section]);

  return <div ref={ref}>{children}</div>;
}

function CaseStudyHeroMedia({
  heroVideoSrc,
  heroVideoEmbedUrl,
  heroVideoTitle,
  heroImageSrc,
  heroImageAlt,
  heroImageWidth = 1920,
  heroImageHeight = 1080,
  heroMediaStyle,
}: Pick<
  CaseStudyLayoutProps,
  | 'heroVideoSrc'
  | 'heroVideoEmbedUrl'
  | 'heroVideoTitle'
  | 'heroImageSrc'
  | 'heroImageAlt'
  | 'heroImageWidth'
  | 'heroImageHeight'
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
            <BackgroundSafeVideo
              className="pointer-events-none block h-auto w-full"
              src={heroVideoSrc}
              loop
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
      <Image
        src={heroImageSrc}
        alt={heroImageAlt ?? ''}
        width={heroImageWidth}
        height={heroImageHeight}
        className="block h-auto w-full"
        sizes="100vw"
        priority
        fetchPriority="high"
      />
    </div>
  );
}

export const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({
  title,
  heroImageSrc,
  heroImageAlt = '',
  heroImageWidth,
  heroImageHeight,
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
  githubLabel = 'Github',
  children,
  className,
}) => {
  const pathname = usePathname();
  const project = projectSlugFromPathname(pathname);

  useEffect(() => {
    trackEvent('project_viewed', { project });
  }, [project]);

  const hasMeta = meta && (meta.duration ?? meta.role ?? meta.tools ?? meta.skills ?? meta.team);
  const hasDefaultHero = Boolean(heroVideoSrc || heroVideoEmbedUrl || heroImageSrc);
  const hasHero = Boolean(hero ?? hasDefaultHero);
  const hasLinks = Boolean(websiteUrl ?? githubUrl);

  const metaEntries = hasMeta
    ? ([
        meta.role ? { label: 'Role', value: meta.role } : null,
        meta.team ? { label: 'Team', value: meta.team } : null,
        meta.tools ? { label: 'Tools', value: meta.tools } : null,
        meta.duration ? { label: 'Duration', value: meta.duration } : null,
        meta.skills ? { label: 'Skills', value: meta.skills } : null,
      ].filter(Boolean) as { label: string; value: React.ReactNode }[])
    : [];

  return (
    <article
      className={cn('min-h-screen bg-background', className)}
      aria-label={`Case study: ${title}`}
    >
      <h1 className="sr-only">{title} case study</h1>
      {hasHero ? (
        <div className="w-full pt-6">
          <ScrollPopdownReveal delayMs={0}>
            <CaseStudySectionReached project={project} section="hero">
            {hero ?? (
              <CaseStudyHeroMedia
                heroVideoSrc={heroVideoSrc}
                heroVideoEmbedUrl={heroVideoEmbedUrl}
                heroVideoTitle={heroVideoTitle}
                heroImageSrc={heroImageSrc}
                heroImageAlt={heroImageAlt}
                heroImageWidth={heroImageWidth}
                heroImageHeight={heroImageHeight}
                heroMediaStyle={heroMediaStyle}
              />
            )}
            </CaseStudySectionReached>
          </ScrollPopdownReveal>
        </div>
      ) : null}

      <div className={cn(CASE_STUDY_CONTENT_CLASS, 'flex flex-col gap-showcase-illustration pt-lg pb-2xl')}>
        <ScrollRevealGroup>
          {(revealed) => (
            <CaseStudySectionReached project={project} section="overview">
            <section
              className="flex flex-col gap-showcase-illustration"
              aria-labelledby="project-overview-heading"
            >
              <PopdownReveal reveal={revealed} delayMs={0}>
                <div className="flex flex-col gap-2xs">
                  <h2 id="project-overview-heading" className="type-label m-0 text-text-subtle">
                    Overview
                  </h2>
                  <div className={cn(CASE_STUDY_OVERVIEW_COLUMNS_CLASS, '[&_p]:m-0')}>
                    {overview}
                  </div>
                </div>
              </PopdownReveal>

              {metaEntries.length > 0 && (
                <div className="grid grid-cols-2 gap-x-showcase-illustration gap-y-md md:grid-cols-4">
                  {metaEntries.map((entry, index) => (
                    <PopdownReveal
                      key={entry.label}
                      reveal={revealed}
                      delayMs={POPDOWN_REVEAL_STAGGER_MS * (index + 1)}
                      className="min-w-0"
                    >
                      <MetaRow label={entry.label} value={entry.value} />
                    </PopdownReveal>
                  ))}
                </div>
              )}

              {hasLinks && (
                <PopdownReveal
                  reveal={revealed}
                  delayMs={POPDOWN_REVEAL_STAGGER_MS * (metaEntries.length + 1)}
                >
                  <div className="grid grid-cols-1 gap-about-role-icon sm:grid-cols-2">
                    {websiteUrl && (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={CASE_STUDY_EXTERNAL_LINK_CLASS}
                        onClick={() =>
                          trackEvent('project_demo_clicked', { project })
                        }
                      >
                        <span className="min-w-0 truncate">{websiteLabel}</span>
                        <ArrowUpRight className="size-5 shrink-0" size={20} aria-hidden />
                      </a>
                    )}
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={CASE_STUDY_EXTERNAL_LINK_CLASS}
                      >
                        <span className="min-w-0 truncate">{githubLabel}</span>
                        <ArrowUpRight className="size-5 shrink-0" size={20} aria-hidden />
                      </a>
                    )}
                  </div>
                </PopdownReveal>
              )}
            </section>
            </CaseStudySectionReached>
          )}
        </ScrollRevealGroup>

        {children ? (
          <div className="flex flex-col gap-4 md:gap-8">
            {React.Children.toArray(children).map((child, index) => (
              <ScrollPopdownReveal key={index} delayMs={0}>
                <CaseStudySectionReached
                  project={project}
                  section={sectionIdFromChild(child, index)}
                >
                  {child}
                </CaseStudySectionReached>
              </ScrollPopdownReveal>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};
