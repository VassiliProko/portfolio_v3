'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/src/utils/cn';
import { GripVertical } from 'lucide-react';

export interface CompareImageProps {
  /** Image shown on the left side of the slider */
  beforeSrc: string;
  /** Image shown on the right side of the slider */
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** Initial divider position 0–100 (default 50) */
  defaultPosition?: number;
  className?: string;
}

export const CompareImage: React.FC<CompareImageProps> = ({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  defaultPosition = 50,
  className,
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  /** 0 = instant, 400 = smooth return to middle on leave. */
  const [transitionMs, setTransitionMs] = useState<0 | 400>(0);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const clamp = (value: number) => Math.min(100, Math.max(0, value));

  const updatePosition = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = clamp((x / rect.width) * 100);
      setPosition(pct);
      return pct;
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      setIsDragging(true);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      setIsDragging(false);
    },
    []
  );

  useEffect(() => {
    if (!isDragging) return;
    const onPointerMove = (e: PointerEvent) => updatePosition(e.clientX);
    const onPointerUp = () => setIsDragging(false);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging, updatePosition]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPosition((p) => clamp(p - step));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPosition((p) => clamp(p + step));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setPosition(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setPosition(100);
      }
    },
    []
  );

  const getPctFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return defaultPosition;
    const rect = el.getBoundingClientRect();
    return clamp(((clientX - rect.left) / rect.width) * 100);
  }, [defaultPosition]);

  const handleContainerPointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) return;
      setIsPointerInside(true);
      setTransitionMs(0);
      setPosition(getPctFromClientX(e.clientX));
    },
    [isDragging, getPctFromClientX]
  );

  const handleContainerPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) return;
      if (!isPointerInside) return;
      const newPct = getPctFromClientX(e.clientX);
      const delta = Math.abs(newPct - position);
      setPosition(newPct);
      if (delta <= 2) setTransitionMs(0);
    },
    [isDragging, isPointerInside, getPctFromClientX, position]
  );

  const handleContainerPointerLeave = useCallback(() => {
    if (isDragging) return;
    setIsPointerInside(false);
    setTransitionMs(400);
    setPosition(defaultPosition);
  }, [isDragging, defaultPosition]);

  return (
    <figure className={cn('w-full', className)}>
      <div
        ref={containerRef}
        className="relative w-full rounded-[8px] overflow-hidden bg-surface-2 select-none touch-none cursor-ew-resize"
        onPointerEnter={handleContainerPointerEnter}
        onPointerMove={handleContainerPointerMove}
        onPointerLeave={handleContainerPointerLeave}
      >
        {/* Base layer: "after" image — in flow so container height matches image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={afterAlt}
          className="relative w-full h-auto block"
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        {/* Overlay: "before" image clipped to left of divider — same transition as divider for sync */}
        <div
          className={cn(
            'absolute inset-0 overflow-hidden',
            !isDragging && transitionMs === 400 && 'transition-[clip-path] duration-[400ms] ease-in'
          )}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeSrc}
            alt=""
            className="w-full h-full object-cover block"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        {/* Draggable divider — follows cursor on hover (eased); drop shadow */}
        <div
          className={cn(
            'absolute top-0 bottom-0 w-6 cursor-ew-resize z-10 flex items-center justify-center -translate-x-1/2',
            !isDragging && transitionMs === 400 && 'transition-[left] duration-[400ms] ease-in'
          )}
          style={{ left: `${position}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="w-1 min-w-[4px] h-full min-h-[80px] flex items-center justify-center transition-colors duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]"
            style={{ boxShadow: 'var(--shadow-compare-divider)' }}
          >
            <div
              className="w-1 min-w-[4px] h-full min-h-[80px] bg-surface-1 border border-border-base rounded-sm flex items-center justify-center focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2 hover:bg-surface-2"
              tabIndex={0}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position)}
              aria-valuetext={`${Math.round(position)}% — drag or use arrow keys to compare`}
              aria-label="Compare before and after — drag or use left/right arrows"
              onKeyDown={handleKeyDown}
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-background shrink-0">
                <GripVertical
                  className="w-5 h-5 text-text-muted pointer-events-none"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
};
