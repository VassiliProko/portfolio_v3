'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DuckDitherCanvas } from '@/src/components/ui/duckIntro/DuckDitherCanvas';
import {
  DUCK_INTRO_DITHER_DELAY_MS,
  DUCK_INTRO_DITHER_DRIFT_EASE,
  DUCK_INTRO_DITHER_DRIFT_Y,
  DUCK_INTRO_DITHER_DURATION_S,
  DUCK_INTRO_DISPLAY_PX,
  DUCK_INTRO_POP_DURATION_S,
  DUCK_INTRO_POP_EASE,
  DUCK_INTRO_POP_OPACITY_FROM,
  DUCK_INTRO_POP_SCALE_FROM,
  DUCK_INTRO_POP_TRANSLATE_Y,
} from '@/src/components/ui/duckIntro/duckIntroSettings';

type DuckIntroSplashProps = {
  active: boolean;
  onComplete: () => void;
};

type IntroPhase = 'entering' | 'dithering' | 'done';

const subscribeNoop = () => () => {};
const getClientReadySnapshot = () => true;
const getServerReadySnapshot = () => false;

/**
 * Full-screen duck intro. Renders a theme-matched placeholder on the server /
 * hydration pass, then runs the sequence once the client store says ready.
 */
export const DuckIntroSplash: React.FC<DuckIntroSplashProps> = ({ active, onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const ready = useSyncExternalStore(
    subscribeNoop,
    getClientReadySnapshot,
    getServerReadySnapshot,
  );
  const [phase, setPhase] = useState<IntroPhase>('entering');
  const ditherDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (ditherDelayTimeoutRef.current) {
        clearTimeout(ditherDelayTimeoutRef.current);
      }
    },
    [],
  );

  const handlePopComplete = useCallback(() => {
    if (ditherDelayTimeoutRef.current) {
      clearTimeout(ditherDelayTimeoutRef.current);
    }
    ditherDelayTimeoutRef.current = setTimeout(() => {
      ditherDelayTimeoutRef.current = null;
      setPhase((current) => (current === 'entering' ? 'dithering' : current));
    }, prefersReducedMotion ? 0 : DUCK_INTRO_DITHER_DELAY_MS);
  }, [prefersReducedMotion]);

  const handleDitherComplete = useCallback(() => {
    setPhase('done');
    onComplete();
  }, [onComplete]);

  if (!active) {
    return null;
  }

  // Identical on server + hydration pass — no motion tree until ready.
  if (!ready || phase === 'done') {
    return (
      <div className="fixed inset-0 z-[55] bg-background" role="presentation" aria-hidden />
    );
  }

  const popTranslateYPx = DUCK_INTRO_DISPLAY_PX * DUCK_INTRO_POP_TRANSLATE_Y;
  const ditherDriftYPx = DUCK_INTRO_DISPLAY_PX * DUCK_INTRO_DITHER_DRIFT_Y;

  return (
    <div className="fixed inset-0 z-[55] bg-background" role="presentation" aria-hidden>
      <div className="flex h-full w-full items-center justify-center">
        <motion.div
          className="will-change-transform"
          initial={
            prefersReducedMotion
              ? { opacity: 1, y: 0, scale: 1 }
              : {
                  opacity: DUCK_INTRO_POP_OPACITY_FROM,
                  y: popTranslateYPx,
                  scale: DUCK_INTRO_POP_SCALE_FROM,
                }
          }
          animate={
            phase === 'dithering'
              ? { opacity: 1, y: -ditherDriftYPx, scale: 1 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : phase === 'entering'
                ? {
                    duration: DUCK_INTRO_POP_DURATION_S,
                    ease: DUCK_INTRO_POP_EASE,
                  }
                : {
                    duration: DUCK_INTRO_DITHER_DURATION_S,
                    ease: DUCK_INTRO_DITHER_DRIFT_EASE,
                  }
          }
          onAnimationComplete={() => {
            if (phase === 'entering') {
              handlePopComplete();
            }
          }}
        >
          <DuckDitherCanvas
            dithering={phase === 'dithering'}
            onComplete={handleDitherComplete}
          />
        </motion.div>
      </div>
    </div>
  );
};
