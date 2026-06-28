'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowRight, Maximize2 } from 'lucide-react';

type WorkCardShellProps = {
  className: string;
  ariaLabel: string;
  hoverTitle?: string;
  hoverYear?: string;
  topRightContent?: React.ReactNode;
  domId?: string;
  href?: string;
  externalHref?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  reveal?: boolean;
  delayMs?: number;
};
type HoverMetaPillsProps = { title?: string; year?: string };
type WorkShowcaseSectionProps = {
  visible?: boolean;
};

const HoverMetaPills: React.FC<HoverMetaPillsProps> = ({ title = 'Project', year = '2026' }) => {
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
            'cursor-pointer rounded-sm bg-surface-1 font-sans text-sm leading-none text-text',
            'transition-colors duration-[60ms] ease-snap',
            'hover:bg-surface-2 focus-visible:bg-surface-2',
            compact ? 'px-2 py-2' : 'px-3 py-2',
          ].join(' ')}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const WorkCardShell: React.FC<WorkCardShellProps> = ({
  className,
  ariaLabel,
  hoverTitle = 'Project',
  hoverYear = '2026',
  topRightContent,
  domId,
  href,
  externalHref,
  style,
  children,
  reveal = true,
  delayMs = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const revealClass = reveal
    ? 'opacity-100 translate-y-0 blur-0'
    : 'opacity-0 -translate-y-3 blur-[2px]';
  const sharedClassName = [
    'group relative w-full overflow-hidden rounded-lg bg-surface-dark-1',
    'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
    revealClass,
    domId === 'play' ? 'scroll-mt-16 md:scroll-mt-20' : '',
    className,
  ].join(' ');
  const mergedStyle: React.CSSProperties = {
    ...style,
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: prefersReducedMotion ? '0ms' : '600ms',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: prefersReducedMotion || !reveal ? '0ms' : `${delayMs}ms`,
    willChange: 'transform, opacity, filter',
  };

  const innerContent = (
    <>
      {children}
      {topRightContent ? <HoverTopRightChip compact>{topRightContent}</HoverTopRightChip> : null}
      <HoverMetaPills title={hoverTitle} year={hoverYear} />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        id={domId}
        aria-label={ariaLabel}
        className={sharedClassName}
        style={mergedStyle}
      >
        {innerContent}
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
        aria-label={ariaLabel}
        className={sharedClassName}
        style={mergedStyle}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <article id={domId} className={sharedClassName} style={mergedStyle} aria-label={ariaLabel}>
      {innerContent}
    </article>
  );
};

const McssFeaturedCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  return (
    <WorkCardShell
      href="/mcss"
      className="aspect-[16/10] p-sm"
      ariaLabel="Open MCSS case study"
      style={{ background: 'var(--gradient-mcss)' }}
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="McGill Chinese Students' Society"
      hoverYear="Website"
      topRightContent={
        <span className="inline-flex items-center gap-1">
          View Case Study
          <ArrowRight size={14} strokeWidth={2} aria-hidden />
        </span>
      }
    >
      <video
        className="pointer-events-none h-full w-full rounded-md object-cover"
        src="/other/mcss_video.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="MCSS featured case study video"
      />
    </WorkCardShell>
  );
};

const ApplicableCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  return (
    <WorkCardShell
      href="/applicable"
      className="aspect-[4/5] px-sm pt-sm pb-0"
      ariaLabel="Open Applicable case study"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="Applicable"
      hoverYear="Web App"
      topRightContent={<Maximize2 size={14} strokeWidth={2} aria-hidden />}
    >
      <Image
        src="/images/optimized/applicable/applicable-home-bg.webp"
        alt=""
        fill
        className="pointer-events-none select-none object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
        priority={false}
      />
      <div className="relative z-[1] flex h-full flex-col justify-end gap-4 px-1 pt-3 sm:px-2 md:px-4">
        <Image
          src="/images/optimized/applicable/logo_motto.svg"
          alt=""
          width={244}
          height={74}
          className="pointer-events-none mx-auto h-auto w-[72%] max-w-[244px] select-none"
          priority={false}
        />
        <Image
          src="/images/optimized/applicable/applicable_ss_home.webp"
          alt=""
          width={1580}
          height={1000}
          className="pointer-events-none h-auto w-full rounded-t-sm bg-surface-1 object-cover object-top select-none"
          sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
          priority={false}
        />
      </div>
    </WorkCardShell>
  );
};

const UsthingCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  return (
    <WorkCardShell
      href="/usthing"
      className="aspect-[4/5] p-sm flex items-end"
      ariaLabel="Open USThing case study"
      hoverTitle="USThing"
      hoverYear="App Feature"
      topRightContent={<Maximize2 size={14} strokeWidth={2} aria-hidden />}
      style={{ background: 'var(--gradient-usthing-app)' }}
      reveal={reveal}
      delayMs={delayMs}
    >
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
              preload="auto"
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
    </WorkCardShell>
  );
};

const WorkColumns: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <div className="flex flex-row items-start gap-3">
      <div className="flex w-1/2 flex-col gap-3 xl:w-1/3">
        <PrettifyMinervaFeaturedCaseStudy reveal={visible} delayMs={0} />
        <UsthingCaseStudy reveal={visible} delayMs={100} />
      </div>
      <div className="flex w-1/2 flex-col gap-3 xl:w-2/3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start">
          <div className="flex flex-col gap-3 xl:w-1/2">
            <ApplicableCaseStudy reveal={visible} delayMs={200} />
          </div>
          <div className="flex flex-col gap-3 xl:w-1/2">
            <McssFeaturedCaseStudy reveal={visible} delayMs={300} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PrettifyMinervaFeaturedCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  return (
    <WorkCardShell
      href="/prettify-minerva"
      className="aspect-[16/10] p-sm"
      ariaLabel="Open Prettify Minerva case study"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="Prettify Minerva"
      hoverYear="Browser Extension"
      topRightContent={
        <span className="inline-flex items-center gap-1">
          View Case Study
          <ArrowRight size={14} strokeWidth={2} aria-hidden />
        </span>
      }
    >
      <Image
        src="/images/optimized/prettify-minerva/prettify-minerva-mock.webp"
        alt=""
        fill
        className="pointer-events-none select-none object-cover scale-105 sm:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
        priority={false}
      />
    </WorkCardShell>
  );
};

export const WorkShowcaseSection: React.FC<WorkShowcaseSectionProps> = ({ visible = false }) => {
  return (
    <section className="w-full pt-2 pb-12 md:pt-4 md:pb-20" aria-label="WorkShowcase" id="work-section">
      <WorkColumns visible={visible} />
    </section>
  );
};
