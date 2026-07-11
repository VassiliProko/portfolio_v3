'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useReducedMotion } from 'motion/react';
import { HoverMetaPill, HoverSurfaceContext, useHoverSurface, usePointerWithinElement } from '@/src/components/ui/HoverMetaPill';
import { ShowcaseLoopingVideo } from '@/src/components/ui/ShowcaseLoopingVideo';
import { ShowcaseRivePreview } from '@/src/components/ui/ShowcaseRivePreview';
import { cn } from '@/src/utils/cn';

type WorkCardShellProps = {
  className: string;
  ariaLabel: string;
  hoverTitle?: string;
  domId?: string;
  href?: string;
  externalHref?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  reveal?: boolean;
  delayMs?: number;
  hideHoverPills?: boolean;
};
type WorkShowcaseSectionProps = {
  visible?: boolean;
};
type ShowcaseColumnCount = 2 | 3;
type ShowcaseCardKey =
  | 'prettify-minerva'
  | 'dojo-icons'
  | 'usthing'
  | 'mcss'
  | 'oneprep-pro-trial'
  | 'visual-explorations';
type ShowcaseCardProps = { reveal?: boolean; delayMs?: number };
type ShowcaseCardConfig = {
  key: ShowcaseCardKey;
  priority: number;
  delayMs: number;
  render: (props: ShowcaseCardProps) => React.ReactNode;
};

const SHOWCASE_THREE_COLUMN_QUERY = '(min-width: 1280px)';

const subscribeToShowcaseColumnChanges = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const mediaQueryList = window.matchMedia(SHOWCASE_THREE_COLUMN_QUERY);

  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', onStoreChange);
    return () => mediaQueryList.removeEventListener('change', onStoreChange);
  }

  mediaQueryList.addListener(onStoreChange);
  return () => mediaQueryList.removeListener(onStoreChange);
};

const getShowcaseColumnSnapshot = () => {
  return typeof window !== 'undefined' && window.matchMedia(SHOWCASE_THREE_COLUMN_QUERY).matches;
};

const getShowcaseServerSnapshot = () => false;

const useShowcaseColumnCount = (): ShowcaseColumnCount => {
  const hasThreeColumns = React.useSyncExternalStore(
    subscribeToShowcaseColumnChanges,
    getShowcaseColumnSnapshot,
    getShowcaseServerSnapshot,
  );

  return hasThreeColumns ? 3 : 2;
};

const WorkCardShell: React.FC<WorkCardShellProps> = ({
  className,
  ariaLabel,
  hoverTitle = 'Project',
  domId,
  href,
  externalHref,
  style,
  children,
  reveal = true,
  delayMs = 0,
  hideHoverPills = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: cardRef, isPointerWithin, localPointer } = usePointerWithinElement<HTMLElement>();
  const hoverContextValue = React.useMemo(
    () => ({ isPointerWithin, localPointer }),
    [isPointerWithin, localPointer],
  );
  const revealClass = reveal
    ? 'opacity-100 translate-y-0 blur-0'
    : 'opacity-0 -translate-y-3 blur-[2px]';
  const sharedClassName = cn(
    'group relative w-full overflow-hidden rounded-lg bg-surface-dark-1',
    'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
    revealClass,
    domId === 'play' && 'scroll-mt-16 md:scroll-mt-20',
    className,
  );
  const mergedStyle: React.CSSProperties = {
    ...style,
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: prefersReducedMotion ? '0ms' : '600ms',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: prefersReducedMotion || !reveal ? '0ms' : `${delayMs}ms`,
    willChange: 'transform, opacity, filter',
  };

  const innerContent = (
    <HoverSurfaceContext.Provider value={hoverContextValue}>
      {children}
      {!hideHoverPills && <HoverMetaPill title={hoverTitle} />}
    </HoverSurfaceContext.Provider>
  );

  if (href) {
    return (
      <Link
        ref={cardRef as React.Ref<HTMLAnchorElement>}
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
        ref={cardRef as React.Ref<HTMLAnchorElement>}
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
    <article
      ref={cardRef as React.Ref<HTMLElement>}
      id={domId}
      className={sharedClassName}
      style={mergedStyle}
      aria-label={ariaLabel}
    >
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
      className="relative aspect-[1352/909]"
      ariaLabel="Open MCSS case study"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="Website & Graphics"
    >
      <Image
        src="/images/optimized/home/mcss-preview.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
        priority={false}
      />
    </WorkCardShell>
  );
};

const DojoIconsCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  return (
    <WorkCardShell
      className="aspect-[2500/1536]"
      ariaLabel="Dojo Icons project preview"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="Dojo / Icons"
    >
      <ShowcaseLoopingVideo
        sources={[
          { src: '/other/dojo-icons-preview-new.webm', type: 'video/webm' },
          { src: '/other/dojo-icons-preview-new.mp4', type: 'video/mp4' },
        ]}
        className="h-full w-full object-cover"
        ariaLabel="Dojo Icons preview animation"
        loopDelayMs={1000}
      />
    </WorkCardShell>
  );
};

const OnePrepProTrialCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  return (
    <WorkCardShell
      className="aspect-[3456/2160]"
      style={{ background: 'transparent' }}
      ariaLabel="OnePrep Pro Trial animation preview"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="OnePrep / Animation"
    >
      <ShowcaseRivePreview
        riveSrc="/other/pro_trial_unlock.riv"
        backgroundSrc="/other/oneprep_trial_background.png"
        ariaLabel="OnePrep Pro Trial unlock animation"
      />
    </WorkCardShell>
  );
};

const VisualExplorationsCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  return (
    <WorkCardShell
      className="aspect-square"
      ariaLabel="Visual Explorations preview"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="Visual Explorations"
    >
      <ShowcaseLoopingVideo
        sources={[
          { src: '/other/heart.webm', type: 'video/webm' },
          { src: '/other/heart.mp4', type: 'video/mp4' },
        ]}
        className="h-full w-full object-cover"
        ariaLabel="Visual Explorations preview animation"
      />
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
      className="flex aspect-[255/292] items-center justify-center p-2xs md:p-xs xl:p-sm"
      ariaLabel="Open USThing case study"
      hoverTitle="USThing / App Feature"
      style={{ background: 'var(--gradient-usthing-app)' }}
      reveal={reveal}
      delayMs={delayMs}
    >
      <Image
        src="/images/optimized/Other/usthing-preview.png"
        alt=""
        width={633}
        height={1314}
        className="pointer-events-none h-auto max-h-[90%] w-[72%] select-none object-contain md:max-h-[86%] md:w-[62%] xl:max-h-[82%] xl:w-[55%]"
        sizes="(max-width: 768px) 36vw, (max-width: 1279px) 32vw, 190px"
        priority={false}
      />
    </WorkCardShell>
  );
};

const WorkColumns: React.FC<{ visible: boolean }> = ({ visible }) => {
  const columnCount = useShowcaseColumnCount();
  const columnGroups = getShowcaseColumnGroups(columnCount);

  return (
    <div className={['grid gap-3', columnCount === 3 ? 'grid-cols-3' : 'grid-cols-2'].join(' ')}>
      {columnGroups.map((column, columnIndex) => (
        <div key={`${columnCount}-${columnIndex}`} className="flex flex-col gap-3">
          {column.map((card) => (
            <React.Fragment key={card.key}>
              {card.render({ reveal: visible, delayMs: card.delayMs })}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

const PrettifyMinervaCardContent: React.FC = () => {
  const { isPointerWithin } = useHoverSurface();

  return (
    <>
      <div
        aria-hidden
        className={[
          'pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-[390ms] ease-move',
          isPointerWithin ? 'opacity-100' : 'opacity-0',
          'group-focus-visible:opacity-100',
          'motion-reduce:transition-none',
        ].join(' ')}
        style={{ background: 'var(--gradient-prettify-minerva-showcase-hover)' }}
      />
      <div
        className="absolute left-[var(--spacing-prettify-minerva-showcase-offset)] top-[var(--spacing-prettify-minerva-showcase-offset)] z-[2] w-full rounded-tl-[6px] shadow-prettify-minerva-showcase-frame"
        aria-hidden
      >
        <div className="overflow-hidden rounded-tl-[6px]">
          <Image
            src="/images/optimized/prettify-minerva/minerva-preview.png"
            alt=""
            width={1054}
            height={908}
            className="pointer-events-none block h-auto w-full max-w-none select-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
            priority={false}
            unoptimized
          />
        </div>
      </div>
    </>
  );
};

const PrettifyMinervaFeaturedCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  return (
    <WorkCardShell
      href="/prettify-minerva"
      className="aspect-[50/39] relative"
      ariaLabel="Open Prettify Minerva case study"
      style={{ background: 'var(--gradient-prettify-minerva-showcase)' }}
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="Prettify Minerva / Browser Extension"
    >
      <PrettifyMinervaCardContent />
    </WorkCardShell>
  );
};

/**
 * Showcase card order and reveal timing.
 * - `priority`: reveal stagger ordering reference (see `delayMs`).
 * - `delayMs`: entrance animation stagger.
 * - Column stack order: card order in `SHOWCASE_COLUMN_KEYS` (top → bottom).
 */
const SHOWCASE_CARD_CONFIGS: ShowcaseCardConfig[] = [
  {
    key: 'prettify-minerva',
    priority: 0,
    delayMs: 0,
    render: (props) => <PrettifyMinervaFeaturedCaseStudy {...props} />,
  },
  {
    key: 'dojo-icons',
    priority: 1,
    delayMs: 100,
    render: (props) => <DojoIconsCaseStudy {...props} />,
  },
  {
    key: 'usthing',
    priority: 2,
    delayMs: 200,
    render: (props) => <UsthingCaseStudy {...props} />,
  },
  {
    key: 'mcss',
    priority: 3,
    delayMs: 300,
    render: (props) => <McssFeaturedCaseStudy {...props} />,
  },
  {
    key: 'oneprep-pro-trial',
    priority: 4,
    delayMs: 400,
    render: (props) => <OnePrepProTrialCaseStudy {...props} />,
  },
  {
    key: 'visual-explorations',
    priority: 5,
    delayMs: 450,
    render: (props) => <VisualExplorationsCaseStudy {...props} />,
  },
];

/** Card keys per column at each breakpoint — add/move keys here to change layout. */
const SHOWCASE_COLUMN_KEYS: Record<ShowcaseColumnCount, ShowcaseCardKey[][]> = {
  2: [
    ['prettify-minerva', 'usthing'],
    ['dojo-icons', 'mcss', 'oneprep-pro-trial', 'visual-explorations'],
  ],
  3: [
    ['prettify-minerva', 'visual-explorations'],
    ['dojo-icons', 'mcss'],
    ['usthing', 'oneprep-pro-trial'],
  ],
};

const getShowcaseColumnGroups = (columnCount: ShowcaseColumnCount) => {
  const cardsByKey = new Map(SHOWCASE_CARD_CONFIGS.map((card) => [card.key, card]));

  return SHOWCASE_COLUMN_KEYS[columnCount].map((columnKeys) =>
    columnKeys
      .map((key) => cardsByKey.get(key))
      .filter((card): card is ShowcaseCardConfig => Boolean(card)),
  );
};

export const WorkShowcaseSection: React.FC<WorkShowcaseSectionProps> = ({ visible = false }) => {
  return (
    <section className="w-full pt-2 pb-12 md:pt-4 md:pb-20" aria-label="WorkShowcase">
      <WorkColumns visible={visible} />
    </section>
  );
};
