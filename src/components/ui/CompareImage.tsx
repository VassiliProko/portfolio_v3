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

/** Idle sway covers 10% of width total (±5% from center). */
const SWAY_AMPLITUDE = 5;
/** Full sway cycle — 50% slower than the prior 6400ms loop. */
const SWAY_PERIOD_MS = 9600;
/** Return-to-center duration — 50% slower than the prior 400ms. */
const RETURN_MS = 600;

/** Approximate of design enter easing cubic-bezier(0, .9, .1, 1). */
function easeReturn(t: number) {
  // Smooth ease-out with a quick start (matches enter token feel)
  return 1 - (1 - t) ** 4;
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
  const [isReturning, setIsReturning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const beforeClipRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(defaultPosition);
  const isDraggingRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const swayRafRef = useRef(0);
  const returnRafRef = useRef(0);

  const clamp = (value: number) => Math.min(100, Math.max(0, value));

  const paintPosition = useCallback((pct: number) => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const clip = beforeClipRef.current;
    const handle = handleRef.current;
    const slider = sliderRef.current;

    if (clip) clip.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;

    if (handle && section && stage) {
      const sectionRect = section.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const x =
        stageRect.left - sectionRect.left + (stageRect.width * pct) / 100;
      handle.style.left = `${x}px`;
    }

    if (slider) {
      const rounded = Math.round(pct);
      slider.setAttribute('aria-valuenow', String(rounded));
      slider.setAttribute(
        'aria-valuetext',
        `${rounded}% — drag or use arrow keys to compare`
      );
    }
  }, []);

  const stopSway = useCallback(() => {
    if (swayRafRef.current) {
      cancelAnimationFrame(swayRafRef.current);
      swayRafRef.current = 0;
    }
  }, []);

  const stopReturn = useCallback(() => {
    if (returnRafRef.current) {
      cancelAnimationFrame(returnRafRef.current);
      returnRafRef.current = 0;
    }
  }, []);

  const startSway = useCallback(() => {
    stopSway();
    if (reduceMotionRef.current) {
      positionRef.current = defaultPosition;
      setPosition(defaultPosition);
      paintPosition(defaultPosition);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      if (reduceMotionRef.current) {
        paintPosition(defaultPosition);
        return;
      }
      const t = (now - start) / SWAY_PERIOD_MS;
      const offset = Math.sin(t * Math.PI * 2) * SWAY_AMPLITUDE;
      const pct = defaultPosition + offset;
      positionRef.current = pct;
      paintPosition(pct);
      swayRafRef.current = requestAnimationFrame(tick);
    };
    swayRafRef.current = requestAnimationFrame(tick);
  }, [defaultPosition, paintPosition, stopSway]);

  const returnToCenterThenSway = useCallback(() => {
    stopSway();
    stopReturn();
    setIsReturning(true);

    const from = positionRef.current;
    const to = defaultPosition;

    if (reduceMotionRef.current || Math.abs(from - to) < 0.1) {
      positionRef.current = to;
      setPosition(to);
      paintPosition(to);
      setIsReturning(false);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / RETURN_MS);
      const pct = from + (to - from) * easeReturn(t);
      positionRef.current = pct;
      paintPosition(pct);
      if (t < 1) {
        returnRafRef.current = requestAnimationFrame(tick);
        return;
      }
      setPosition(to);
      setIsReturning(false);
    };
    returnRafRef.current = requestAnimationFrame(tick);
  }, [defaultPosition, paintPosition, stopReturn, stopSway]);

  const updatePosition = useCallback(
    (clientX: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const pct = clamp(((clientX - rect.left) / rect.width) * 100);
      positionRef.current = pct;
      setPosition(pct);
      paintPosition(pct);
    },
    [paintPosition]
  );

  const beginDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      stopSway();
      stopReturn();
      setIsReturning(false);
      isDraggingRef.current = true;
      setIsDragging(true);
      updatePosition(e.clientX);
    },
    [stopReturn, stopSway, updatePosition]
  );

  const endDrag = useCallback(
    (e?: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (e) {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      }
      setIsDragging(false);
      returnToCenterThenSway();
    },
    [returnToCenterThenSway]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onPointerMove = (e: PointerEvent) => updatePosition(e.clientX);
    const onPointerUp = () => endDrag();
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging, updatePosition, endDrag]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = mq.matches;
    const onChange = () => {
      reduceMotionRef.current = mq.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isDragging || isReturning) return;
    startSway();
    return () => stopSway();
  }, [isDragging, isReturning, startSway, stopSway]);

  useEffect(
    () => () => {
      stopSway();
      stopReturn();
    },
    [stopReturn, stopSway]
  );

  // Keep handle aligned if the section reflows (resize / font load).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ro = new ResizeObserver(() => paintPosition(positionRef.current));
    ro.observe(section);
    paintPosition(positionRef.current);
    return () => ro.disconnect();
  }, [paintPosition]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 2;
      const apply = (next: number) => {
        stopSway();
        stopReturn();
        setIsReturning(false);
        positionRef.current = next;
        setPosition(next);
        paintPosition(next);
      };
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        apply(clamp(positionRef.current - step));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        apply(clamp(positionRef.current + step));
      } else if (e.key === 'Home') {
        e.preventDefault();
        apply(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        apply(100);
      }
    },
    [paintPosition, stopReturn, stopSway]
  );

  const handleSliderBlur = useCallback(() => {
    if (isDraggingRef.current) return;
    returnToCenterThenSway();
  }, [returnToCenterThenSway]);

  return (
    <figure className={cn('w-full', className)}>
      <div
        ref={sectionRef}
        className="relative w-full overflow-hidden rounded-[8px] bg-surface-dark-2 select-none touch-none"
      >
        {/* Images inset so dark section background shows on left / right / top */}
        <div className="px-6 pt-6 md:px-10 md:pt-10">
          <div
            ref={stageRef}
            className="relative w-full overflow-hidden rounded-t-[8px]"
          >
            {/* Base layer: "after" image — in flow so stage height matches image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterSrc}
              alt={afterAlt}
              className="relative block h-auto w-full rounded-t-[8px]"
              loading="lazy"
              decoding="async"
              draggable={false}
            />

            {/* Overlay: "before" image clipped to left of divider */}
            <div
              ref={beforeClipRef}
              className="absolute inset-0 overflow-hidden rounded-t-[8px]"
              style={{ clipPath: `inset(0 ${100 - defaultPosition}% 0 0)` }}
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforeSrc}
                alt=""
                className="block h-full w-full rounded-t-[8px] object-cover"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Full-section-height divider — sharp corners, drag-only */}
        <div
          ref={handleRef}
          className="absolute top-0 bottom-0 z-10 flex w-6 -translate-x-1/2 cursor-grab items-center justify-center active:cursor-grabbing"
          style={{ left: '50%' }}
          onPointerDown={beginDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className="flex h-full w-1 min-w-[4px] items-center justify-center">
            <div
              ref={sliderRef}
              className={cn(
                'flex h-full w-1 min-w-[4px] items-center justify-center bg-surface-1',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
              )}
              tabIndex={0}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position)}
              aria-valuetext={`${Math.round(position)}% — drag or use arrow keys to compare`}
              aria-label="Compare before and after — drag or use left/right arrows"
              onKeyDown={handleKeyDown}
              onBlur={handleSliderBlur}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                <GripVertical
                  className="pointer-events-none h-5 w-5 text-text-muted"
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
