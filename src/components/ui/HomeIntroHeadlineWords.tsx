'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const DELIGHTFUL = 'delightful';
const DELIGHTFUL_MAX_LIFT_PX = 12;
const DELIGHTFUL_INFLUENCE_PX = 120;
const DELIGHTFUL_HIT_EXTEND_HORIZONTAL_PX = 120;
const DELIGHTFUL_HIT_EXTEND_TOP_PX = 72;
/** Kept modest so the hit area does not swallow the subtitle link when lines wrap tight. */
const DELIGHTFUL_HIT_EXTEND_BOTTOM_PX = 16;
const DELIGHTFUL_HORIZONTAL_DISTANCE_WEIGHT = 1.5;
const DELIGHTFUL_LIFT_TRANSITION_MS = 30;
const DELIGHTFUL_FALL_TRANSITION_MS = 320;
const DELIGHTFUL_FALL_DELAY_MS = 48;
const DELIGHTFUL_FALL_STAGGER_MS = 14;
const DELIGHTFUL_LIFT_EASING = 'cubic-bezier(0,.9,.1,1)';
const DELIGHTFUL_FALL_EASING = 'cubic-bezier(.4,0,1,1)';

type DelightfulLetterMotion = {
  durationMs: number;
  delayMs: number;
  staggerMs: number;
  easing: string;
};

const DELIGHTFUL_LIFT_MOTION: DelightfulLetterMotion = {
  durationMs: DELIGHTFUL_LIFT_TRANSITION_MS,
  delayMs: 0,
  staggerMs: 0,
  easing: DELIGHTFUL_LIFT_EASING,
};

const DELIGHTFUL_FALL_MOTION: DelightfulLetterMotion = {
  durationMs: DELIGHTFUL_FALL_TRANSITION_MS,
  delayMs: DELIGHTFUL_FALL_DELAY_MS,
  staggerMs: DELIGHTFUL_FALL_STAGGER_MS,
  easing: DELIGHTFUL_FALL_EASING,
};

/** 0 at hit-box edge, 1 at center — scales letter lift so boundaries have no effect. */
function hitBoxEdgeFalloff(
  clientX: number,
  clientY: number,
  rect: DOMRect
): number {
  if (rect.width <= 0 || rect.height <= 0) {
    return 0;
  }

  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const falloffX = (2 * Math.min(x, rect.width - x)) / rect.width;
  const falloffY = (2 * Math.min(y, rect.height - y)) / rect.height;

  return Math.min(Math.max(0, falloffX), Math.max(0, falloffY));
}

export const IntroDelightfulWord: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const hitAreaRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const [offsets, setOffsets] = useState<number[]>(() => Array(DELIGHTFUL.length).fill(0));
  const [letterMotion, setLetterMotion] = useState<DelightfulLetterMotion>(DELIGHTFUL_LIFT_MOTION);

  const resetOffsets = useCallback(() => {
    setOffsets(Array(DELIGHTFUL.length).fill(0));
  }, []);

  const handleMouseEnter = useCallback(() => {
    setLetterMotion(DELIGHTFUL_LIFT_MOTION);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (prefersReducedMotion) {
        return;
      }

      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const letters = containerRef.current?.querySelectorAll<HTMLElement>('[data-letter]');
        const hitRect = hitAreaRef.current?.getBoundingClientRect();
        if (!letters?.length || !hitRect) {
          return;
        }

        const edgeFalloff = hitBoxEdgeFalloff(event.clientX, event.clientY, hitRect);

        const nextOffsets = Array.from(letters).map((letter) => {
          const rect = letter.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = (event.clientX - centerX) * DELIGHTFUL_HORIZONTAL_DISTANCE_WEIGHT;
          const dy = event.clientY - centerY;
          const distance = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - distance / DELIGHTFUL_INFLUENCE_PX);
          const influence = proximity * edgeFalloff;

          return -influence * DELIGHTFUL_MAX_LIFT_PX;
        });

        setOffsets(nextOffsets);
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    // Defer reset so the last hover offset paints before CSS transition to 0
    window.requestAnimationFrame(() => {
      setLetterMotion(DELIGHTFUL_FALL_MOTION);
      resetOffsets();
    });
  }, [resetOffsets]);

  return (
    <span
      ref={hitAreaRef}
      className="relative inline-block"
      style={{
        marginLeft: -DELIGHTFUL_HIT_EXTEND_HORIZONTAL_PX,
        marginRight: -DELIGHTFUL_HIT_EXTEND_HORIZONTAL_PX,
        marginTop: -DELIGHTFUL_HIT_EXTEND_TOP_PX,
        marginBottom: -DELIGHTFUL_HIT_EXTEND_BOTTOM_PX,
        paddingLeft: DELIGHTFUL_HIT_EXTEND_HORIZONTAL_PX,
        paddingRight: DELIGHTFUL_HIT_EXTEND_HORIZONTAL_PX,
        paddingTop: DELIGHTFUL_HIT_EXTEND_TOP_PX,
        paddingBottom: DELIGHTFUL_HIT_EXTEND_BOTTOM_PX,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={containerRef} className="pointer-events-none inline-block">
        {DELIGHTFUL.split('').map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            data-letter
            className="inline-block motion-reduce:transition-none"
            style={{
              transform: `translateY(${offsets[index]}px)`,
              transition: prefersReducedMotion
                ? undefined
                : `transform ${letterMotion.durationMs}ms ${letterMotion.easing} ${letterMotion.delayMs + index * letterMotion.staggerMs}ms`,
            }}
          >
            {letter}
          </span>
        ))}
        {'\u00A0'}
      </span>
    </span>
  );
};

export const HOME_INTRO_HEADLINE_SEGMENTS = [
  { key: 'hi', content: 'hi,' },
  { key: 'im', content: 'im' },
  { key: 'a', content: 'a' },
  { key: 'young', content: 'young' },
  { key: 'lad', content: 'lad' },
  { key: 'busy', content: 'busy' },
  { key: 'munching', content: 'munching' },
  { key: 'and', content: '&' },
  { key: 'cooking', content: 'cooking' },
  { key: 'delightful', content: <IntroDelightfulWord />, className: 'relative z-10' },
  { key: 'creations', content: 'creations', className: 'relative z-0', skipLeadingSpace: true },
] as const;
