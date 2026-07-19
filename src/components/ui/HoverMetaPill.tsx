'use client';

import React from 'react';

export const FROST_UNDERLAY_OPACITY = 0.68;

type HoverSurfaceContextValue = {
  isPointerWithin: boolean;
  localPointer: { x: number; y: number } | null;
};

export const HoverSurfaceContext = React.createContext<HoverSurfaceContextValue>({
  isPointerWithin: false,
  localPointer: null,
});

export const useHoverSurface = () => React.useContext(HoverSurfaceContext);

export const usePointerWithinElement = <T extends HTMLElement>() => {
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

type HoverMetaPillProps = {
  title?: string;
};

export const HoverMetaPill: React.FC<HoverMetaPillProps> = ({ title = 'Project' }) => {
  const { isPointerWithin } = useHoverSurface();
  const visible = isPointerWithin;
  const visibleClass = visible
    ? 'translate-y-0 scale-100 opacity-100 blur-0'
    : 'translate-y-4 scale-95 opacity-0 blur-[4px]';
  const pillStyle: React.CSSProperties = {
    background:
      'linear-gradient(180deg, color-mix(in srgb, var(--color-background) 24%, transparent), color-mix(in srgb, var(--color-surface-1) 8%, transparent)) padding-box, linear-gradient(180deg, color-mix(in srgb, var(--color-background) 38%, transparent), color-mix(in srgb, var(--color-text) 8%, transparent)) border-box',
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-start px-3">
      <div
        className={[
          'relative inline-flex max-w-full transition-all duration-[360ms] ease-move will-change-[transform,opacity,filter]',
          visibleClass,
          'origin-bottom-left group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:blur-0',
          'motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:blur-0 motion-reduce:transition-none',
        ].join(' ')}
      >
        <div
          aria-hidden
          className={[
            'absolute inset-0 rounded-sm bg-background transition-opacity duration-[360ms] ease-move',
            'motion-reduce:transition-none',
          ].join(' ')}
          style={{ opacity: FROST_UNDERLAY_OPACITY }}
        />
        <div
          className={[
            'type-paragraph relative box-border overflow-hidden rounded-sm border border-transparent px-3 py-2 leading-none text-text backdrop-blur-2xl backdrop-saturate-150',
          ].join(' ')}
          style={pillStyle}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

type HoverSurfaceProps = {
  children: React.ReactNode;
  className?: string;
  hoverTitle: string;
};

export const HoverSurface: React.FC<HoverSurfaceProps> = ({
  children,
  className,
  hoverTitle,
}) => {
  const { ref, isPointerWithin, localPointer } = usePointerWithinElement<HTMLDivElement>();
  const hoverContextValue = React.useMemo(
    () => ({ isPointerWithin, localPointer }),
    [isPointerWithin, localPointer],
  );

  return (
    <HoverSurfaceContext.Provider value={hoverContextValue}>
      <div ref={ref} className={['group relative', className].filter(Boolean).join(' ')}>
        {children}
        <HoverMetaPill title={hoverTitle} />
      </div>
    </HoverSurfaceContext.Provider>
  );
};
