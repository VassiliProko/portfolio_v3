'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useReducedMotion } from 'motion/react';
import { ShowcaseLoopingVideo } from '@/src/components/ui/ShowcaseLoopingVideo';

type WorkCardHoverContextValue = {
  isPointerWithin: boolean;
  localPointer: { x: number; y: number } | null;
};

const WorkCardHoverContext = React.createContext<WorkCardHoverContextValue>({
  isPointerWithin: false,
  localPointer: null,
});

const useWorkCardHover = () => React.useContext(WorkCardHoverContext);

const usePointerWithinElement = <T extends HTMLElement>() => {
  const ref = React.useRef<T>(null);
  const pointerRef = React.useRef<{ clientX: number; clientY: number } | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const [isPointerWithin, setIsPointerWithin] = React.useState(false);
  const [localPointer, setLocalPointer] = React.useState<{ x: number; y: number } | null>(null);

  const updatePointerState = React.useCallback(() => {
    const element = ref.current;
    const pointer = pointerRef.current;

    if (!element || !pointer) {
      setIsPointerWithin(false);
      setLocalPointer(null);
      return;
    }

    const rect = element.getBoundingClientRect();
    const within =
      pointer.clientX >= rect.left &&
      pointer.clientX <= rect.right &&
      pointer.clientY >= rect.top &&
      pointer.clientY <= rect.bottom;

    setIsPointerWithin(within);
    setLocalPointer(
      within
        ? {
            x: pointer.clientX - rect.left,
            y: pointer.clientY - rect.top,
          }
        : null,
    );
  }, []);

  const schedulePointerStateUpdate = React.useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updatePointerState();
    });
  }, [updatePointerState]);

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { clientX: event.clientX, clientY: event.clientY };
      schedulePointerStateUpdate();
    };

    const handlePointerLeaveWindow = () => {
      pointerRef.current = null;
      setIsPointerWithin(false);
      setLocalPointer(null);
    };

    const handleLayoutChange = () => {
      schedulePointerStateUpdate();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleLayoutChange, true);
    window.addEventListener('resize', handleLayoutChange);
    document.documentElement.addEventListener('pointerleave', handlePointerLeaveWindow);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleLayoutChange, true);
      window.removeEventListener('resize', handleLayoutChange);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeaveWindow);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [schedulePointerStateUpdate]);

  return { ref, isPointerWithin, localPointer };
};

type WorkCardShellProps = {
  className: string;
  ariaLabel: string;
  hoverTitle?: string;
  hoverYear?: string;
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
type ShowcaseColumnCount = 2 | 3;
type ShowcaseCardKey =
  | 'prettify-minerva'
  | 'dojo-icons'
  | 'usthing'
  | 'mcss'
  | 'oneprep-pro-trial';
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

const HoverMetaPills: React.FC<HoverMetaPillsProps> = ({ title = 'Project', year = '2026' }) => {
  const { isPointerWithin } = useWorkCardHover();
  const visibleClass = isPointerWithin
    ? 'translate-y-0 opacity-100'
    : 'translate-y-3 opacity-0';

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-between px-3">
      <div
        className={[
          'rounded-sm bg-surface-1 px-3 py-2 font-sans text-sm leading-none text-text',
          'transition-all duration-[260ms] ease-move',
          visibleClass,
          'group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
          'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        ].join(' ')}
      >
        {title}
      </div>
      <div
        className={[
          'rounded-sm bg-surface-1 px-3 py-2 font-sans text-sm leading-none text-text',
          'transition-all duration-[260ms] ease-move',
          visibleClass,
          'group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
          'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        ].join(' ')}
      >
        {year}
      </div>
    </div>
  );
};

const WorkCardShell: React.FC<WorkCardShellProps> = ({
  className,
  ariaLabel,
  hoverTitle = 'Project',
  hoverYear = '2026',
  domId,
  href,
  externalHref,
  style,
  children,
  reveal = true,
  delayMs = 0,
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
    <WorkCardHoverContext.Provider value={hoverContextValue}>
      {children}
      <HoverMetaPills title={hoverTitle} year={hoverYear} />
    </WorkCardHoverContext.Provider>
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
      className="p-sm"
      ariaLabel="Open MCSS case study"
      style={{ background: 'var(--gradient-mcss)' }}
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="McGill Chinese Students' Society"
      hoverYear="Website"
    >
      <ShowcaseLoopingVideo
        src="/other/mcss_video.webm"
        className="block w-full rounded-md aspect-[1908/1080] object-contain"
        ariaLabel="MCSS featured case study video"
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
      className="aspect-[1280/780]"
      ariaLabel="Dojo Icons project preview"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="Dojo Icons"
      hoverYear="Icon Set"
    >
      <ShowcaseLoopingVideo
        src="/other/dojo-icons-preview.webm"
        className="h-full w-full object-cover"
        ariaLabel="Dojo Icons preview animation"
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
      ariaLabel="OnePrep Pro Trial animation preview"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="OnePrep Pro Trial"
      hoverYear="Animation"
    >
      <ShowcaseLoopingVideo
        src="/other/oneprep-trial-unlock.mp4"
        className="h-full w-full object-cover"
        ariaLabel="OnePrep Pro Trial unlock animation"
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
      className="aspect-[4/5] p-sm flex items-end"
      ariaLabel="Open USThing case study"
      hoverTitle="USThing"
      hoverYear="App Feature"
      style={{ background: 'var(--gradient-usthing-app)' }}
      reveal={reveal}
      delayMs={delayMs}
    >
      <div className="absolute inset-x-0 top-0 flex items-start justify-center overflow-hidden pt-3">
        <div className="relative w-[clamp(266px,95vw,302px)] aspect-[281/584]">
          <div className="absolute left-[7.1%] right-[7.1%] top-[6.6%] bottom-[6.7%] overflow-hidden rounded-[34px]">
            <ShowcaseLoopingVideo
              src="/other/grade_distribution_showcase_short.webm"
              className="absolute top-0 w-[186%] h-auto"
              ariaLabel="Grade Distribution mobile app preview"
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
  const prefersReducedMotion = useReducedMotion();
  const { isPointerWithin, localPointer } = useWorkCardHover();
  const showCursorGlow = isPointerWithin && localPointer !== null && !prefersReducedMotion;

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
        aria-hidden
        className={[
          'pointer-events-none absolute z-[1] aspect-square w-3/4 -translate-x-1/2 -translate-y-1/2 mix-blend-soft-light',
          'transition-opacity duration-[390ms] ease-move motion-reduce:hidden',
          showCursorGlow ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{
          left: localPointer?.x ?? 0,
          top: localPointer?.y ?? 0,
          background: 'var(--gradient-prettify-minerva-showcase-cursor-glow)',
        }}
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
      hoverTitle="Prettify Minerva"
      hoverYear="Browser Extension"
    >
      <PrettifyMinervaCardContent />
    </WorkCardShell>
  );
};

/**
 * Showcase card order and reveal timing.
 * - `priority`: lower = earlier in column stack and higher in the grid (0 is first).
 * - `delayMs`: entrance animation stagger; usually priority * 100.
 * - Column placement: edit `SHOWCASE_COLUMN_KEYS` below.
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
];

/** Card keys per column at each breakpoint — add/move keys here to change layout. */
const SHOWCASE_COLUMN_KEYS: Record<ShowcaseColumnCount, ShowcaseCardKey[][]> = {
  2: [
    ['prettify-minerva', 'usthing'],
    ['dojo-icons', 'mcss', 'oneprep-pro-trial'],
  ],
  3: [
    ['prettify-minerva', 'usthing'],
    ['dojo-icons', 'mcss'],
    ['oneprep-pro-trial'],
  ],
};

const getShowcaseColumnGroups = (columnCount: ShowcaseColumnCount) => {
  const cardsByKey = new Map(SHOWCASE_CARD_CONFIGS.map((card) => [card.key, card]));

  return SHOWCASE_COLUMN_KEYS[columnCount].map((columnKeys) =>
    columnKeys
      .map((key) => cardsByKey.get(key))
      .filter((card): card is ShowcaseCardConfig => Boolean(card))
      .sort((a, b) => a.priority - b.priority),
  );
};

export const WorkShowcaseSection: React.FC<WorkShowcaseSectionProps> = ({ visible = false }) => {
  return (
    <section className="w-full pt-2 pb-12 md:pt-4 md:pb-20" aria-label="WorkShowcase">
      <WorkColumns visible={visible} />
    </section>
  );
};
