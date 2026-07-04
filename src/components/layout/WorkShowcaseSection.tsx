'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useReducedMotion } from 'motion/react';
import { ShowcaseLoopingVideo } from '@/src/components/ui/ShowcaseLoopingVideo';
import { ShowcaseRivePreview } from '@/src/components/ui/ShowcaseRivePreview';

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
  hoverVariant?: HoverMetaPillVariant;
  domId?: string;
  href?: string;
  externalHref?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  reveal?: boolean;
  delayMs?: number;
};
type HoverMetaPillVariant =
  | 'figma-glass'
  | 'split-lift'
  | 'soft-pop'
  | 'cursor-drift'
  | 'clip-slide'
  | 'deep-frost'
  | 'aurora-glass'
  | 'stacked-blur'
  | 'prism-sheen'
  | 'lens-pop';
type HoverMetaPillsProps = {
  title?: string;
  variant?: HoverMetaPillVariant;
};
type WorkShowcaseSectionProps = {
  visible?: boolean;
};
type ShowcaseColumnCount = 2 | 3;
type ShowcaseCardKey =
  | 'dojo-icons-figma-glass'
  | 'dojo-icons-split-lift'
  | 'dojo-icons-soft-pop'
  | 'dojo-icons-cursor-drift'
  | 'dojo-icons-clip-slide'
  | 'dojo-icons-deep-frost'
  | 'dojo-icons-aurora-glass'
  | 'dojo-icons-stacked-blur'
  | 'dojo-icons-prism-sheen'
  | 'dojo-icons-lens-pop'
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

const HoverMetaPills: React.FC<HoverMetaPillsProps> = ({
  title = 'Project',
  variant = 'figma-glass',
}) => {
  const { isPointerWithin, localPointer } = useWorkCardHover();
  const visible = isPointerWithin;
  const driftX = localPointer ? Math.max(-10, Math.min(10, localPointer.x * 0.04 - 10)) : 0;
  const driftY = localPointer ? Math.max(-4, Math.min(4, localPointer.y * 0.02 - 4)) : 0;
  const basePillClass =
    'box-border overflow-hidden rounded-sm px-3 py-2 font-sans text-sm leading-none transition-all ease-move will-change-[transform,opacity,filter,clip-path]';

  const variantClasses: Record<
    HoverMetaPillVariant,
    {
      container: string;
      pill: string;
      titleHidden: string;
      titleVisible: string;
      yearHidden: string;
      yearVisible: string;
      style?: React.CSSProperties;
      pillStyle?: React.CSSProperties;
      haloClass?: string;
      haloStyle?: React.CSSProperties;
    }
  > = {
    'figma-glass': {
      container: 'bottom-3 justify-start gap-2 px-3',
      pill: 'border border-border-base bg-surface-1/80 text-text backdrop-blur-md duration-[260ms]',
      titleHidden: 'translate-y-3 opacity-0 blur-[2px]',
      titleVisible: 'translate-y-0 opacity-100 blur-0',
      yearHidden: 'translate-y-3 opacity-0 blur-[2px]',
      yearVisible: 'translate-y-0 opacity-100 blur-0',
    },
    'split-lift': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-border-base bg-surface-1 text-text duration-[320ms]',
      titleHidden: '-translate-x-4 translate-y-4 -rotate-2 opacity-0 blur-[2px]',
      titleVisible: 'translate-x-0 translate-y-0 rotate-0 opacity-100 blur-0',
      yearHidden: 'translate-x-4 translate-y-4 rotate-2 opacity-0 blur-[2px]',
      yearVisible: 'translate-x-0 translate-y-0 rotate-0 opacity-100 blur-0',
    },
    'soft-pop': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-border-divider bg-surface-2 text-text duration-[300ms]',
      titleHidden: 'translate-y-2 scale-95 opacity-0 blur-[3px]',
      titleVisible: 'translate-y-0 scale-100 opacity-100 blur-0',
      yearHidden: 'translate-y-2 scale-95 opacity-0 blur-[3px]',
      yearVisible: 'translate-y-0 scale-100 opacity-100 blur-0',
    },
    'cursor-drift': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-border-base bg-surface-1/90 text-text backdrop-blur-md duration-[220ms]',
      titleHidden: 'translate-y-3 opacity-0 blur-[2px]',
      titleVisible: 'translate-y-0 opacity-100 blur-0',
      yearHidden: 'translate-y-3 opacity-0 blur-[2px]',
      yearVisible: 'translate-y-0 opacity-100 blur-0',
      style:
        visible && localPointer
          ? {
              transform: `translate3d(${driftX}px, ${driftY}px, 0)`,
            }
          : undefined,
    },
    'clip-slide': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-border-base bg-surface-1 text-text duration-[340ms]',
      titleHidden: 'translate-y-2 opacity-0 blur-[2px]',
      titleVisible: 'translate-y-0 opacity-100 blur-0',
      yearHidden: 'translate-y-2 opacity-0 blur-[2px]',
      yearVisible: 'translate-y-0 opacity-100 blur-0',
      style: {
        clipPath: visible ? 'inset(0 0 0 0 round 4px)' : 'inset(0 100% 0 0 round 4px)',
      },
    },
    'deep-frost': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-transparent text-text backdrop-blur-xl duration-[360ms]',
      titleHidden: 'translate-y-4 scale-95 opacity-0 blur-[4px]',
      titleVisible: 'translate-y-0 scale-100 opacity-100 blur-0',
      yearHidden: 'translate-y-4 scale-95 opacity-0 blur-[4px]',
      yearVisible: 'translate-y-0 scale-100 opacity-100 blur-0',
      pillStyle: {
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-surface-1) 68%, transparent), color-mix(in srgb, var(--color-background) 42%, transparent)) padding-box, linear-gradient(180deg, color-mix(in srgb, var(--color-background) 90%, transparent), color-mix(in srgb, var(--color-primary-base) 42%, transparent)) border-box',
        boxShadow:
          '0 18px 40px color-mix(in srgb, var(--color-text) 22%, transparent), 0 4px 12px color-mix(in srgb, var(--color-text) 16%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-background) 70%, transparent)',
      },
    },
    'aurora-glass': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-transparent text-text backdrop-blur-lg duration-[380ms]',
      titleHidden: '-translate-x-3 translate-y-3 scale-95 opacity-0 blur-[3px]',
      titleVisible: 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0',
      yearHidden: 'translate-x-3 translate-y-3 scale-95 opacity-0 blur-[3px]',
      yearVisible: 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0',
      pillStyle: {
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--color-surface-1) 72%, transparent), color-mix(in srgb, var(--color-primary-base) 22%, transparent) 48%, color-mix(in srgb, var(--color-accent-base) 26%, transparent)) padding-box, linear-gradient(180deg, color-mix(in srgb, var(--color-background) 86%, transparent), color-mix(in srgb, var(--color-primary-base) 60%, transparent) 52%, color-mix(in srgb, var(--color-accent-base) 64%, transparent)) border-box',
        boxShadow:
          '0 18px 38px color-mix(in srgb, var(--color-primary-base) 28%, transparent), 0 4px 12px color-mix(in srgb, var(--color-accent-base) 18%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-background) 72%, transparent)',
      },
    },
    'stacked-blur': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-transparent text-text backdrop-blur-xl duration-[420ms]',
      titleHidden: 'translate-y-5 opacity-0 blur-[5px]',
      titleVisible: 'translate-y-0 opacity-100 blur-0',
      yearHidden: 'translate-y-5 opacity-0 blur-[5px]',
      yearVisible: 'translate-y-0 opacity-100 blur-0',
      pillStyle: {
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-surface-1) 72%, transparent), color-mix(in srgb, var(--color-surface-2) 58%, transparent)) padding-box, linear-gradient(180deg, color-mix(in srgb, var(--color-background) 80%, transparent), color-mix(in srgb, var(--color-accent-base) 52%, transparent)) border-box',
        boxShadow:
          '0 24px 52px color-mix(in srgb, var(--color-text) 20%, transparent), 0 6px 18px color-mix(in srgb, var(--color-primary-base) 16%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-background) 72%, transparent)',
      },
      haloClass: visible ? 'opacity-100 blur-xl scale-100' : 'opacity-0 blur-lg scale-90',
      haloStyle: {
        background:
          'linear-gradient(90deg, color-mix(in srgb, var(--color-primary-base) 34%, transparent), color-mix(in srgb, var(--color-accent-base) 30%, transparent))',
      },
    },
    'prism-sheen': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-transparent text-text backdrop-blur-lg duration-[360ms]',
      titleHidden: 'translate-y-3 skew-x-3 opacity-0 blur-[3px]',
      titleVisible: 'translate-y-0 skew-x-0 opacity-100 blur-0',
      yearHidden: 'translate-y-3 -skew-x-3 opacity-0 blur-[3px]',
      yearVisible: 'translate-y-0 skew-x-0 opacity-100 blur-0',
      pillStyle: {
        background:
          'linear-gradient(110deg, color-mix(in srgb, var(--color-background) 68%, transparent) 0%, color-mix(in srgb, var(--color-surface-1) 72%, transparent) 42%, color-mix(in srgb, var(--color-primary-base) 20%, transparent) 58%, color-mix(in srgb, var(--color-background) 58%, transparent) 100%) padding-box, linear-gradient(180deg, color-mix(in srgb, var(--color-background) 90%, transparent), color-mix(in srgb, var(--color-primary-base) 52%, transparent) 48%, color-mix(in srgb, var(--color-accent-base) 58%, transparent)) border-box',
        boxShadow:
          '0 18px 40px color-mix(in srgb, var(--color-text) 20%, transparent), 0 4px 14px color-mix(in srgb, var(--color-primary-base) 18%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-background) 80%, transparent)',
      },
    },
    'lens-pop': {
      container: 'bottom-3 justify-start px-3',
      pill: 'border border-transparent text-text backdrop-blur-2xl duration-[400ms]',
      titleHidden: 'translate-y-4 scale-90 opacity-0 blur-[4px]',
      titleVisible: '-translate-y-1 scale-105 opacity-100 blur-0',
      yearHidden: 'translate-y-4 scale-90 opacity-0 blur-[4px]',
      yearVisible: '-translate-y-1 scale-105 opacity-100 blur-0',
      pillStyle: {
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-surface-1) 74%, transparent), color-mix(in srgb, var(--color-background) 50%, transparent)) padding-box, linear-gradient(180deg, color-mix(in srgb, var(--color-background) 92%, transparent), color-mix(in srgb, var(--color-primary-base) 56%, transparent) 46%, color-mix(in srgb, var(--color-text) 24%, transparent)) border-box',
        boxShadow:
          '0 24px 56px color-mix(in srgb, var(--color-text) 28%, transparent), 0 6px 18px color-mix(in srgb, var(--color-primary-base) 22%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-background) 76%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--color-primary-base) 24%, transparent)',
      },
      haloClass: visible ? 'opacity-100 blur-2xl scale-110' : 'opacity-0 blur-lg scale-95',
      haloStyle: {
        background:
          'radial-gradient(circle, color-mix(in srgb, var(--color-background) 55%, transparent) 0%, color-mix(in srgb, var(--color-primary-base) 28%, transparent) 52%, transparent 76%)',
      },
    },
  };

  const selectedVariant = variantClasses[variant];

  return (
    <div
      className={[
        'pointer-events-none absolute inset-x-0 z-10 flex items-center',
        selectedVariant.haloClass ? 'overflow-visible' : '',
        'transition-all duration-[260ms] ease-move',
        selectedVariant.container,
        'motion-reduce:!translate-x-0 motion-reduce:!translate-y-0 motion-reduce:transition-none',
      ].join(' ')}
      style={selectedVariant.style}
    >
      {selectedVariant.haloClass ? (
        <div
          aria-hidden
          className={[
            'absolute inset-x-3 bottom-0 h-full rounded-sm transition-all duration-[420ms] ease-move motion-reduce:hidden',
            selectedVariant.haloClass,
          ].join(' ')}
          style={selectedVariant.haloStyle}
        />
      ) : null}
      <div
        className={[
          'relative z-[1]',
          basePillClass,
          selectedVariant.pill,
          visible ? selectedVariant.titleVisible : selectedVariant.titleHidden,
          'origin-bottom-left group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:rotate-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:blur-0',
          'motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:rotate-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:blur-0 motion-reduce:transition-none',
        ].join(' ')}
        style={selectedVariant.pillStyle}
      >
        {title}
      </div>
    </div>
  );
};

const WorkCardShell: React.FC<WorkCardShellProps> = ({
  className,
  ariaLabel,
  hoverTitle = 'Project',
  hoverVariant = 'figma-glass',
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
      <HoverMetaPills title={hoverTitle} variant={hoverVariant} />
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
    >
      <ShowcaseLoopingVideo
        src="/other/mcss_video.webm"
        className="block w-full rounded-md aspect-[1908/1080] object-contain"
        ariaLabel="MCSS featured case study video"
      />
    </WorkCardShell>
  );
};

const DojoIconsCaseStudy: React.FC<{
  reveal?: boolean;
  delayMs?: number;
  hoverVariant?: HoverMetaPillVariant;
}> = ({
  reveal = true,
  delayMs = 0,
  hoverVariant = 'figma-glass',
}) => {
  return (
    <WorkCardShell
      className="aspect-[2500/1536]"
      ariaLabel="Dojo Icons project preview"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="Dojo Icons"
      hoverVariant={hoverVariant}
    >
      <ShowcaseLoopingVideo
        sources={[
          { src: '/other/dojo-icons-preview-new.webm', type: 'video/webm' },
          { src: '/other/dojo-icons-preview-new.mp4', type: 'video/mp4' },
        ]}
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
      style={{ background: 'transparent' }}
      ariaLabel="OnePrep Pro Trial animation preview"
      reveal={reveal}
      delayMs={delayMs}
      hoverTitle="OnePrep Pro Trial"
    >
      <ShowcaseRivePreview
        riveSrc="/other/pro_trial_unlock.riv"
        backgroundSrc="/other/oneprep_trial_background.png"
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
      className="p-sm flex flex-col items-center"
      ariaLabel="Open USThing case study"
      hoverTitle="USThing"
      style={{ background: 'var(--gradient-usthing-app)' }}
      reveal={reveal}
      delayMs={delayMs}
    >
      <div className="relative w-full max-w-[340px]">
        <div className="absolute left-[7.1%] right-[7.1%] top-[6%] bottom-[5.7%] overflow-hidden rounded-[clamp(22px,12%,34px)]">
          <ShowcaseLoopingVideo
            src="/other/grade_distribution_showcase_short.webm"
            className="pointer-events-none absolute top-0 w-[186%] h-auto"
            ariaLabel="Grade Distribution mobile app preview"
          />
        </div>
        <Image
          src="/images/optimized/Other/iphone_case.webp"
          alt=""
          width={281}
          height={584}
          className="pointer-events-none select-none h-auto w-full object-contain scale-[.92]"
          sizes="(max-width: 768px) 45vw, (max-width: 1279px) 50vw, 340px"
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
    key: 'dojo-icons-figma-glass',
    priority: 0,
    delayMs: 0,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="figma-glass" />,
  },
  {
    key: 'dojo-icons-split-lift',
    priority: 1,
    delayMs: 100,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="split-lift" />,
  },
  {
    key: 'dojo-icons-soft-pop',
    priority: 2,
    delayMs: 200,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="soft-pop" />,
  },
  {
    key: 'dojo-icons-cursor-drift',
    priority: 3,
    delayMs: 300,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="cursor-drift" />,
  },
  {
    key: 'dojo-icons-clip-slide',
    priority: 4,
    delayMs: 400,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="clip-slide" />,
  },
  {
    key: 'dojo-icons-deep-frost',
    priority: 5,
    delayMs: 500,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="deep-frost" />,
  },
  {
    key: 'dojo-icons-aurora-glass',
    priority: 6,
    delayMs: 600,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="aurora-glass" />,
  },
  {
    key: 'dojo-icons-stacked-blur',
    priority: 7,
    delayMs: 700,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="stacked-blur" />,
  },
  {
    key: 'dojo-icons-prism-sheen',
    priority: 8,
    delayMs: 800,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="prism-sheen" />,
  },
  {
    key: 'dojo-icons-lens-pop',
    priority: 9,
    delayMs: 900,
    render: (props) => <DojoIconsCaseStudy {...props} hoverVariant="lens-pop" />,
  },
];

/** Card keys per column at each breakpoint — add/move keys here to change layout. */
const SHOWCASE_COLUMN_KEYS: Record<ShowcaseColumnCount, ShowcaseCardKey[][]> = {
  2: [
    [
      'dojo-icons-figma-glass',
      'dojo-icons-soft-pop',
      'dojo-icons-clip-slide',
      'dojo-icons-aurora-glass',
      'dojo-icons-prism-sheen',
    ],
    [
      'dojo-icons-split-lift',
      'dojo-icons-cursor-drift',
      'dojo-icons-deep-frost',
      'dojo-icons-stacked-blur',
      'dojo-icons-lens-pop',
    ],
  ],
  3: [
    ['dojo-icons-figma-glass', 'dojo-icons-cursor-drift', 'dojo-icons-deep-frost', 'dojo-icons-lens-pop'],
    ['dojo-icons-split-lift', 'dojo-icons-clip-slide', 'dojo-icons-stacked-blur'],
    ['dojo-icons-soft-pop', 'dojo-icons-aurora-glass', 'dojo-icons-prism-sheen'],
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
