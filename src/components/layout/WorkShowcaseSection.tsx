'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Alignment } from '@rive-app/react-canvas';
import { useReducedMotion } from 'motion/react';
import { HoverMetaPill, HoverSurfaceContext, usePointerWithinElement } from '@/src/components/ui/HoverMetaPill';
import {
  ImagePreview,
  IMAGE_PREVIEW_TRIGGER_MEDIA_CLASS,
  type ImagePreviewItem,
} from '@/src/components/ui/ImagePreview';
import { ShowcaseLoopingVideo } from '@/src/components/ui/ShowcaseLoopingVideo';
import { ShowcaseRivePreview } from '@/src/components/ui/ShowcaseRivePreview';
import { getPopdownRevealProps } from '@/src/components/ui/PopdownReveal';
import { cn } from '@/src/utils/cn';

type WorkCardShellProps = {
  className: string;
  ariaLabel: string;
  hoverTitle?: string;
  domId?: string;
  href?: string;
  externalHref?: string;
  /** Opens a non-navigating action (e.g. image preview). Uses zoom-in cursor. */
  onActivate?: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
  reveal?: boolean;
  delayMs?: number;
  hideHoverPills?: boolean;
  /**
   * When false, the surface is in-flow so padded media can define height
   * (illustration cards). Default true keeps absolute fill for aspect-ratio cards.
   */
  fillSurface?: boolean;
};

const YINLIN_IMAGE_PREVIEW: ImagePreviewItem = {
  src: '/images/optimized/home/yinlin-preview.jpg',
  name: 'Yinlin Illustration',
  description: 'Fanart of a Wuthering Waves character',
  width: 1186,
  height: 661,
  captionTone: 'on-dark',
};

const DISCORD_SNOWSGIVING_IMAGE_PREVIEW: ImagePreviewItem = {
  src: '/images/optimized/home/discord-snowsgiving-preview.jpg',
  name: 'Discord Snowsgiving',
  description:
    'I won the Best Digital Art Prize (1 of 5 category winners) at Discord Snowsgiving for the "Draw a Wumpus" theme. I recieved some cool Discord merch, including a cute Wumpus plushie.',
  width: 1200,
  height: 675,
};

const MATHSGENIE_IMAGE_PREVIEW: ImagePreviewItem = {
  src: '/other/genie-landing-page.riv',
  name: 'MathsGenie Animation',
  description:
    'A Rive animation made for MathsGenie, the GCSE and A Level maths revision resource used by 1M+ students.',
  width: 16,
  height: 9,
  rive: {
    src: '/other/genie-landing-page.riv',
    playbackMode: 'entry-then-loop-once',
    alignment: Alignment.Center,
    backgroundColor: 'var(--color-mathsgenie-showcase-bg)',
  },
};
type WorkShowcaseSectionProps = {
  visible?: boolean;
  /** Animate the whole grid once (return home visit) instead of staggering cards */
  unifiedReveal?: boolean;
};
type ShowcaseColumnCount = 2 | 3;
type ShowcaseCardKey =
  | 'prettify-minerva'
  | 'dojo-icons'
  | 'usthing'
  | 'mcss'
  | 'mathsgenie'
  | 'oneprep-pro-trial'
  | 'visual-explorations'
  | 'discord-snowsgiving'
  | 'yinlin';
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
  onActivate,
  style,
  children,
  reveal = true,
  delayMs = 0,
  hideHoverPills = false,
  fillSurface = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: cardRef, isPointerWithin, localPointer } = usePointerWithinElement<HTMLElement>();
  const hoverContextValue = React.useMemo(
    () => ({ isPointerWithin, localPointer }),
    [isPointerWithin, localPointer],
  );
  const isLinked = Boolean(href || externalHref);
  const isPreviewTrigger = Boolean(onActivate) && !isLinked;
  const revealClass = reveal
    ? 'opacity-100 translate-y-0 blur-0'
    : 'opacity-0 -translate-y-3 blur-[2px]';
  const revealDelayMs = prefersReducedMotion || !reveal ? 0 : delayMs;

  // Outer: layout + hit area only. Surface: the visible card (radius + clip + scale).
  // Matching USThing — radius scales with the surface; children stay inset with padding.
  const layoutClassName = cn(
    'group relative w-full',
    'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
    isPreviewTrigger && 'cursor-zoom-in',
    revealClass,
    domId === 'play' && 'scroll-mt-16 md:scroll-mt-20',
    className,
  );
  const hasCustomSurfaceBackground = Boolean(style?.background || style?.backgroundColor);
  const surfaceClassName = cn(
    'overflow-hidden rounded-lg',
    fillSurface ? 'absolute inset-0' : 'relative w-full',
    !hasCustomSurfaceBackground && 'bg-surface-dark-1',
    isLinked &&
      !prefersReducedMotion &&
      'origin-center transform-gpu transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[0.98] group-focus-visible:scale-[0.98]',
  );
  const layoutStyle: React.CSSProperties = prefersReducedMotion
    ? {
        transition: 'none',
      }
    : {
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: '600ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${revealDelayMs}ms`,
        willChange: 'transform, opacity, filter',
      };

  const innerContent = (
    <HoverSurfaceContext.Provider value={hoverContextValue}>
      <div className={surfaceClassName} style={style}>
        {children}
        {!hideHoverPills && <HoverMetaPill title={hoverTitle} />}
      </div>
    </HoverSurfaceContext.Provider>
  );

  if (href) {
    return (
      <Link
        ref={cardRef as React.Ref<HTMLAnchorElement>}
        href={href}
        id={domId}
        aria-label={ariaLabel}
        className={layoutClassName}
        style={layoutStyle}
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
        className={layoutClassName}
        style={layoutStyle}
      >
        {innerContent}
      </a>
    );
  }

  if (onActivate) {
    return (
      <button
        type="button"
        ref={cardRef as React.Ref<HTMLButtonElement>}
        id={domId}
        aria-label={ariaLabel}
        className={cn(layoutClassName, 'border-0 bg-transparent p-0 text-left')}
        style={layoutStyle}
        onClick={onActivate}
      >
        {innerContent}
      </button>
    );
  }

  return (
    <article
      ref={cardRef as React.Ref<HTMLElement>}
      id={domId}
      className={layoutClassName}
      style={layoutStyle}
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
      href="/dojo-icons"
      className="aspect-[2500/1536]"
      ariaLabel="Open RevisionDojo Icons case study"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="RevisionDojo Icons"
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

const MathsGenieCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  const [previewOpen, setPreviewOpen] = React.useState(false);

  return (
    <>
      <WorkCardShell
        className="aspect-[16/9]"
        style={{ backgroundColor: 'var(--color-mathsgenie-showcase-bg)' }}
        ariaLabel="Open MathsGenie animation preview"
        reveal={reveal}
        delayMs={delayMs}
        hoverTitle="MathsGenie Animation"
        onActivate={() => setPreviewOpen(true)}
      >
        <ShowcaseRivePreview
          riveSrc="/other/genie-landing-page.riv"
          ariaLabel="MathsGenie entry and loop animation"
          playbackMode="entry-then-loop-once"
          riveAlignment={Alignment.Center}
        />
      </WorkCardShell>
      <ImagePreview
        item={MATHSGENIE_IMAGE_PREVIEW}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
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
      hoverTitle="OnePrep Animation"
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
      hoverTitle="A Cute Heart Animation"
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
      className="aspect-[255/292]"
      ariaLabel="Open USThing case study"
      hoverTitle="USThing App Feature"
      style={{ background: 'var(--gradient-usthing-app)' }}
      reveal={reveal}
      delayMs={delayMs}
    >
      <div className="flex h-full w-full items-center justify-center p-2xs md:p-xs xl:p-sm">
        <Image
          src="/images/optimized/Other/usthing-preview.png"
          alt=""
          width={633}
          height={1314}
          className="pointer-events-none h-auto max-h-[90%] w-[72%] select-none object-contain md:max-h-[86%] md:w-[62%] xl:max-h-[82%] xl:w-[55%]"
          sizes="(max-width: 768px) 36vw, (max-width: 1279px) 32vw, 190px"
          priority={false}
        />
      </div>
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
  return (
    <>
      {/* Nested like USThing: padded inset, clipped by the scaling surface radius. */}
      <div
        className="absolute inset-0 z-[2] p-[var(--spacing-prettify-minerva-showcase-offset)] pb-0 pr-0"
        aria-hidden
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-tl-[6px] shadow-prettify-minerva-showcase-frame"
          style={{ backgroundColor: 'var(--color-prettify-minerva-chrome)' }}
        >
          <Image
            src="/images/optimized/prettify-minerva/minerva-preview.png"
            alt=""
            fill
            className="pointer-events-none select-none object-cover object-left-top"
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
      hoverTitle="Prettify Minerva ∙ Browser Extension"
    >
      <PrettifyMinervaCardContent />
    </WorkCardShell>
  );
};

type IllustrationShowcaseCardProps = {
  reveal?: boolean;
  delayMs?: number;
  src: string;
  ariaLabel: string;
  hoverTitle: string;
  background: string;
  /** When set, opens ImagePreview (full-bleed art — no padded gradient). */
  previewItem?: ImagePreviewItem;
};

/** Padded 16:9 illustration on a project gradient surface. */
const IllustrationShowcaseCard: React.FC<IllustrationShowcaseCardProps> = ({
  reveal = true,
  delayMs = 0,
  src,
  ariaLabel,
  hoverTitle,
  background,
  previewItem,
}) => {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const opensPreview = Boolean(previewItem);

  return (
    <>
      <WorkCardShell
        className="relative"
        ariaLabel={ariaLabel}
        hoverTitle={hoverTitle}
        reveal={reveal}
        delayMs={delayMs}
        fillSurface={false}
        style={{ background }}
        onActivate={opensPreview ? () => setPreviewOpen(true) : undefined}
      >
        <div className="box-border flex w-full items-center justify-center p-showcase-illustration-sm sm:p-showcase-illustration">
          <div
            className={cn(
              'relative aspect-[16/9] w-full rounded',
              // Preview triggers scale past the frame into the gradient pad (no edge crop).
              opensPreview ? 'overflow-visible' : 'overflow-hidden',
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              className={cn(
                'pointer-events-none select-none object-cover rounded',
                opensPreview && IMAGE_PREVIEW_TRIGGER_MEDIA_CLASS,
                opensPreview && 'z-[1]',
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
              priority={false}
            />
          </div>
        </div>
      </WorkCardShell>
      {previewItem ? (
        <ImagePreview
          item={previewItem}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </>
  );
};

const DiscordSnowsgivingCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => (
  <IllustrationShowcaseCard
    reveal={reveal}
    delayMs={delayMs}
    src={DISCORD_SNOWSGIVING_IMAGE_PREVIEW.src}
    ariaLabel="Open Discord Snowsgiving illustration preview"
    hoverTitle="Discord Snowsgiving"
    background="var(--gradient-discord-snowsgiving-showcase)"
    previewItem={DISCORD_SNOWSGIVING_IMAGE_PREVIEW}
  />
);

/** Full-bleed illustration — image fills the card at its native aspect ratio. */
const YinlinIllustrationCaseStudy: React.FC<{ reveal?: boolean; delayMs?: number }> = ({
  reveal = true,
  delayMs = 0,
}) => {
  const [previewOpen, setPreviewOpen] = React.useState(false);

  return (
    <>
      <WorkCardShell
        className="relative"
        ariaLabel="Open Yinlin illustration preview"
        hoverTitle="Yinlin Illustration"
        reveal={reveal}
        delayMs={delayMs}
        fillSurface={false}
        onActivate={() => setPreviewOpen(true)}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={YINLIN_IMAGE_PREVIEW.src}
            alt=""
            fill
            className={cn(
              'pointer-events-none select-none object-cover',
              IMAGE_PREVIEW_TRIGGER_MEDIA_CLASS,
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
            priority={false}
          />
        </div>
      </WorkCardShell>
      <ImagePreview
        item={YINLIN_IMAGE_PREVIEW}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

/**
 * Showcase card order and reveal timing.
 * - `priority`: reveal stagger ordering reference (see `delayMs`).
 * - `delayMs`: entrance animation stagger (50% faster than original 0–450ms).
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
    key: 'discord-snowsgiving',
    priority: 1,
    delayMs: 25,
    render: (props) => <DiscordSnowsgivingCaseStudy {...props} />,
  },
  {
    key: 'yinlin',
    priority: 2,
    delayMs: 45,
    render: (props) => <YinlinIllustrationCaseStudy {...props} />,
  },
  {
    key: 'dojo-icons',
    priority: 3,
    delayMs: 50,
    render: (props) => <DojoIconsCaseStudy {...props} />,
  },
  {
    key: 'usthing',
    priority: 4,
    delayMs: 100,
    render: (props) => <UsthingCaseStudy {...props} />,
  },
  {
    key: 'mcss',
    priority: 5,
    delayMs: 150,
    render: (props) => <McssFeaturedCaseStudy {...props} />,
  },
  {
    key: 'mathsgenie',
    priority: 6,
    delayMs: 175,
    render: (props) => <MathsGenieCaseStudy {...props} />,
  },
  {
    key: 'oneprep-pro-trial',
    priority: 7,
    delayMs: 200,
    render: (props) => <OnePrepProTrialCaseStudy {...props} />,
  },
  {
    key: 'visual-explorations',
    priority: 8,
    delayMs: 225,
    render: (props) => <VisualExplorationsCaseStudy {...props} />,
  },
];

/** Card keys per column at each breakpoint — add/move keys here to change layout. */
const SHOWCASE_COLUMN_KEYS: Record<ShowcaseColumnCount, ShowcaseCardKey[][]> = {
  2: [
    ['prettify-minerva', 'discord-snowsgiving', 'yinlin', 'usthing'],
    ['dojo-icons', 'mcss', 'mathsgenie', 'visual-explorations'],
  ],
  3: [
    ['prettify-minerva', 'discord-snowsgiving', 'yinlin'],
    ['dojo-icons', 'mcss', 'visual-explorations'],
    ['usthing', 'mathsgenie'],
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

export const WorkShowcaseSection: React.FC<WorkShowcaseSectionProps> = ({
  visible = false,
  unifiedReveal = false,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (unifiedReveal) {
    const revealProps = getPopdownRevealProps(visible, 0, prefersReducedMotion);

    return (
      <section className="w-full pt-2 pb-12 md:pt-4 md:pb-20" aria-label="WorkShowcase">
        <div className={revealProps.className} style={revealProps.style}>
          <WorkColumns visible />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-2 pb-12 md:pt-4 md:pb-20" aria-label="WorkShowcase">
      <WorkColumns visible={visible} />
    </section>
  );
};
