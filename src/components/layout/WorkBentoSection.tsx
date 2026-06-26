'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { PlaygroundPreviewExperience } from '@/src/components/ui/PlaygroundPreviewExperience';

type WorkBentoItemProps = {
  title: string;
  size?: 'large' | 'small' | 'playground';
  hoverTitle?: string;
  hoverYear?: string;
  topRightContent?: React.ReactNode;
  domId?: string;
  href?: string;
  externalHref?: string;
};


const HoverMetaPills: React.FC<{ title?: string; year?: string }> = ({ title = 'Project', year = '2026' }) => {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-between px-3">
      <div
        className={[
          'rounded-sm bg-surface-1 px-3 py-2 font-sans text-sm leading-none text-text',
          'translate-y-3 opacity-0 transition-all duration-[260ms] ease-move',
          'group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
          'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        ].join(' ')}
      >
        {title}
      </div>
      <div
        className={[
          'rounded-sm bg-surface-1 px-3 py-2 font-sans text-sm leading-none text-text',
          'translate-y-3 opacity-0 transition-all duration-[260ms] ease-move',
          'group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
          'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        ].join(' ')}
      >
        {year}
      </div>
    </div>
  );
};

const HoverTopRightChip: React.FC<{ children: React.ReactNode; compact?: boolean }> = ({ children, compact = false }) => {
  return (
    <div className="absolute right-3 top-3 z-10">
      <div
        className={[
          '-translate-y-2 opacity-0 transition-all duration-[260ms] ease-move',
          'group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
          'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        ].join(' ')}
      >
        <div
          className={[
            'cursor-pointer rounded-sm bg-surface-dark-1 font-sans text-sm leading-none text-text-inverted-1',
            'transition-colors duration-[60ms] ease-snap',
            'hover:bg-surface-dark-2 focus-visible:bg-surface-dark-2',
            compact ? 'px-2 py-2' : 'px-3 py-2',
          ].join(' ')}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const WorkBentoItem: React.FC<WorkBentoItemProps> = ({
  title,
  size = 'small',
  hoverTitle = 'Project',
  hoverYear = '2026',
  topRightContent,
  domId,
  href,
  externalHref,
}) => {
  const isPlayground = size === 'playground';
  const isLarge = size === 'large';
  const isSecondSmallCaseCard = title === 'Case Study Small 02';
  const isApplicableSmallCaseCard = title === 'Case Study Small 01';
  const spanClass = isPlayground ? 'col-span-full md:col-span-2 lg:col-span-3' : isLarge ? 'md:col-span-2 lg:col-span-2' : 'lg:col-span-1';

  const rootClassName = [
    'group relative overflow-hidden rounded-lg border border-border-base bg-surface-dark-1',
    domId === 'play' ? 'scroll-mt-16 md:scroll-mt-20' : '',
    isApplicableSmallCaseCard ? 'px-sm pt-sm pb-0' : 'p-sm',
    isApplicableSmallCaseCard ? 'flex flex-col' : 'flex items-end',
    spanClass,
    isPlayground
      ? 'col-span-full min-h-[520px] lg:h-[600px]'
      : isApplicableSmallCaseCard
        ? ''
        : 'min-h-[450px]',
  ].join(' ');

  const content = (
    <>
      <span className="sr-only">{title}</span>
      {isSecondSmallCaseCard ? (
        <div className="absolute inset-x-0 top-0 flex items-start justify-center overflow-hidden pt-3">
          <div className="relative w-[clamp(266px,95vw,302px)] aspect-[281/584]">
            <div className="absolute left-[7.1%] right-[7.1%] top-[6.6%] bottom-[6.7%] overflow-hidden rounded-[34px]">
              <video
                className="pointer-events-none absolute top-0 w-[186%] h-auto"
                src="/other/grade_distribution_showcase_short.webm"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Grade Distribution mobile app preview"
              />
            </div>
            <Image
              src="/images/optimized/Other/iphone_case.webp"
              alt=""
              fill
              className="pointer-events-none select-none object-contain scale-[0.92] origin-top translate-y-[29px]"
              sizes="(max-width: 768px) 95vw, 302px"
              priority={false}
            />
          </div>
        </div>
      ) : null}
      {isApplicableSmallCaseCard ? (
        <>
          <div className="absolute inset-0">
            <Image
              src="/images/optimized/applicable/applicable-home-bg.webp"
              alt=""
              fill
              className="pointer-events-none select-none object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
              priority={false}
            />
          </div>
          <div className="relative z-[1] mt-auto flex w-full flex-col items-center gap-5 px-2 pt-4 sm:px-2 md:px-5 md:pt-5 lg:px-4 lg:pt-4">
            <Image
              src="/images/optimized/applicable/logo_motto.svg"
              alt=""
              width={244}
              height={74}
              className="pointer-events-none select-none h-auto w-[72%] max-w-[244px]"
              priority={false}
            />
            <div className="overflow-hidden rounded-t-sm rounded-b-none border border-border-base bg-surface-1">
              <Image
                src="/images/optimized/applicable/applicable_ss_home.webp"
                alt=""
                width={1580}
                height={1000}
                className="pointer-events-none select-none h-auto w-full object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority={false}
              />
            </div>
          </div>
        </>
      ) : null}
      {isPlayground ? (
        <>
          <div className="absolute inset-0">
            <PlaygroundPreviewExperience
              className="h-full"
              cardClassName="h-full rounded-lg overflow-hidden cursor-pointer bg-surface-dark-1"
              showHeader={false}
              showBottomFade={false}
              showCursorTooltip={false}
              columnsClassName="columns-3 gap-x-xs"
              previewContentClassName="pt-3"
              maxHeight="600px"
              topRightContent={topRightContent}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[96px] z-[2] bg-gradient-to-t from-surface-dark-1 to-transparent" />
        </>
      ) : null}
      {!isPlayground && topRightContent ? <HoverTopRightChip compact>{topRightContent}</HoverTopRightChip> : null}
      <HoverMetaPills title={hoverTitle} year={hoverYear} />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        id={domId}
        aria-label={`Open ${hoverTitle} case study`}
        className={[
          rootClassName,
          'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
        ].join(' ')}
        style={isSecondSmallCaseCard ? { background: 'var(--gradient-usthing-app)' } : undefined}
      >
        {content}
      </Link>
    );
  }

  if (externalHref) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        id={domId}
        aria-label={`Open ${hoverTitle} website`}
        className={[
          rootClassName,
          'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
        ].join(' ')}
        style={isSecondSmallCaseCard ? { background: 'var(--gradient-usthing-app)' } : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      id={domId}
      className={rootClassName}
      style={isSecondSmallCaseCard ? { background: 'var(--gradient-usthing-app)' } : undefined}
      aria-label={`${title} placeholder`}
    >
      {content}
    </article>
  );
};

const McssFeaturedCaseStudy: React.FC = () => {
  return (
    <Link
      href="/mcss"
      className={[
        'group relative overflow-hidden md:col-span-2 lg:col-span-2 min-h-[280px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[450px] rounded-lg border border-border-base p-sm',
        'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
      ].join(' ')}
      style={{ background: 'var(--gradient-mcss)' }}
      aria-label="Open MCSS case study"
    >
      <div className="h-full w-full rounded-lg overflow-hidden p-3 md:p-5 flex items-center justify-center">
        <div className="w-full max-w-[780px] aspect-video rounded-lg overflow-hidden">
          <video
            className="h-full w-full pointer-events-none object-cover"
            src="/other/mcss_video.webm"
            autoPlay
            muted
            loop
            playsInline
            aria-label="MCSS featured case study video"
          />
        </div>
      </div>
      <HoverTopRightChip>
        <span className="inline-flex items-center gap-1">
          View Case Study
          <ArrowRight size={14} strokeWidth={2} aria-hidden />
        </span>
      </HoverTopRightChip>
      <HoverMetaPills title="McGill Chinese Students' Society" year="Website" />
    </Link>
  );
};

const PrettifyMinervaFeaturedCaseStudy: React.FC = () => {
  return (
    <Link
      href="/prettify-minerva"
      className={[
        'group relative overflow-hidden md:col-span-2 lg:col-span-2 min-h-[280px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[450px] rounded-lg border border-border-base p-sm',
        'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
      ].join(' ')}
      aria-label="Open Prettify Minerva case study"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/optimized/prettify-minerva/prettify-minerva-mock.webp"
          alt=""
          fill
          className="pointer-events-none select-none object-cover scale-105 sm:scale-110"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority={false}
        />
      </div>
      <HoverTopRightChip>
        <span className="inline-flex items-center gap-1">
          View Case Study
          <ArrowRight size={14} strokeWidth={2} aria-hidden />
        </span>
      </HoverTopRightChip>
      <HoverMetaPills title="Prettify Minerva" year="Browser Extension" />
    </Link>
  );
};

export const WorkBentoSection: React.FC = () => {
  return (
    <section
      className="w-full py-12 md:py-20 animate-fade-in-up-fast"
      aria-labelledby="work"
      id="work-section"
    >
      <h2
        id="work"
        className="text-text font-sans font-medium text-2xl md:text-3xl mb-8 md:mb-10"
      >
        Work
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <McssFeaturedCaseStudy />
          <WorkBentoItem
            title="Case Study Small 02"
            size="small"
            hoverTitle="USThing"
            hoverYear="App Feature"
            topRightContent={<Maximize2 size={14} strokeWidth={2} aria-hidden />}
            href="/usthing"
          />
          <WorkBentoItem
            title="Case Study Small 01"
            size="small"
            hoverTitle="Applicable"
            hoverYear="Web App"
            topRightContent={<Maximize2 size={14} strokeWidth={2} aria-hidden />}
            href="/applicable"
          />

          <PrettifyMinervaFeaturedCaseStudy />

          <WorkBentoItem
            title="Playground"
            size="playground"
            domId="play"
            hoverTitle="Visual Playground"
            hoverYear="2023 - Present"
            topRightContent={
              <span className="inline-flex items-center gap-1">
                View All
                <Maximize2 size={14} strokeWidth={2} aria-hidden />
              </span>
            }
          />
        </div>
    </section>
  );
};
