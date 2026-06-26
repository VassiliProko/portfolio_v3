'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useAnimationControls, useReducedMotion } from 'motion/react';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';
import {
  HOME_NAV_ENTER_EASE,
  HOME_NAV_LOGO_OUTBOUND_S,
  HOME_NAV_LOGO_PEAK_FALLBACK_PX,
  HOME_NAV_LOGO_PEAK_WIDTH_MULTIPLIER,
  HOME_NAV_LOGO_PECK_EASE,
  HOME_NAV_LOGO_PECK_PEAK_AT,
  HOME_NAV_LOGO_PECK_REPEAT_DELAY_MS,
  HOME_NAV_LOGO_PECK_ROTATE,
  HOME_NAV_LOGO_PECK_S,
  HOME_NAV_LOGO_PECK_X,
  HOME_NAV_LOGO_PECK_Y,
  HOME_NAV_LOGO_RETURN_S,
  HOME_NAV_RIGHT_ENTER_EASE,
  HOME_NAV_RIGHT_ENTER_OFFSET_PX,
  HOME_NAV_RIGHT_ENTER_S,
} from '@/src/components/ui/homeNavbarMotion';

function scrollToAbout(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('about');
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function measureLogoPeakOffset(logoEl: HTMLElement) {
  return logoEl.offsetWidth * HOME_NAV_LOGO_PEAK_WIDTH_MULTIPLIER;
}

export const HomeNavbar: React.FC = () => {
  const { enableNavbarEnter, notifyNavbarPeak } = useHomeEnterAnimation();
  const prefersReducedMotion = useReducedMotion();
  const logoRef = useRef<HTMLSpanElement>(null);
  const isHomeHoveringRef = useRef(false);
  const peckLoopRunningRef = useRef(false);
  const peckRepeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [peakOffsetPx, setPeakOffsetPx] = useState<number | null>(null);
  const [enterComplete, setEnterComplete] = useState(!enableNavbarEnter);
  const logoControls = useAnimationControls();
  const peckControls = useAnimationControls();
  const textControls = useAnimationControls();
  const rightControls = useAnimationControls();

  useLayoutEffect(() => {
    if (!enableNavbarEnter) {
      return;
    }

    if (!logoRef.current) {
      setPeakOffsetPx(HOME_NAV_LOGO_PEAK_FALLBACK_PX);
      return;
    }

    setPeakOffsetPx(measureLogoPeakOffset(logoRef.current));
  }, [enableNavbarEnter]);

  useEffect(() => {
    if (!enableNavbarEnter) {
      logoControls.set({ x: 0 });
      textControls.set({ opacity: 1, x: 0 });
      rightControls.set({ opacity: 1, y: 0 });
      setEnterComplete(true);
      return;
    }

    setEnterComplete(false);

    if (peakOffsetPx === null) {
      return;
    }

    let cancelled = false;

    const runSequence = async () => {
      logoControls.set({ x: 0 });
      textControls.set({ opacity: 0, x: peakOffsetPx });
      rightControls.set({ opacity: 0, y: -HOME_NAV_RIGHT_ENTER_OFFSET_PX });

      await logoControls.start({
        x: peakOffsetPx,
        transition: {
          duration: HOME_NAV_LOGO_OUTBOUND_S,
          ease: HOME_NAV_ENTER_EASE,
        },
      });

      if (cancelled) {
        return;
      }

      notifyNavbarPeak();

      rightControls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration: HOME_NAV_RIGHT_ENTER_S,
          ease: HOME_NAV_RIGHT_ENTER_EASE,
        },
      });

      await Promise.all([
        logoControls.start({
          x: 0,
          transition: {
            duration: HOME_NAV_LOGO_RETURN_S,
            ease: HOME_NAV_ENTER_EASE,
          },
        }),
        textControls.start({
          opacity: 1,
          x: 0,
          transition: {
            duration: HOME_NAV_LOGO_RETURN_S,
            ease: HOME_NAV_ENTER_EASE,
          },
        }),
      ]);

      if (!cancelled) {
        setEnterComplete(true);
      }
    };

    void runSequence();

    return () => {
      cancelled = true;
    };
  }, [
    enableNavbarEnter,
    logoControls,
    notifyNavbarPeak,
    peakOffsetPx,
    rightControls,
    textControls,
  ]);

  const runPeckOnce = useCallback(async () => {
    await peckControls.start({
      x: [0, HOME_NAV_LOGO_PECK_X, 0],
      y: [0, HOME_NAV_LOGO_PECK_Y, 0],
      rotate: [0, HOME_NAV_LOGO_PECK_ROTATE, 0],
      transition: {
        duration: HOME_NAV_LOGO_PECK_S,
        times: [0, HOME_NAV_LOGO_PECK_PEAK_AT, 1],
        ease: HOME_NAV_LOGO_PECK_EASE,
      },
    });
  }, [peckControls]);

  const clearPeckRepeat = useCallback(() => {
    if (peckRepeatTimeoutRef.current) {
      clearTimeout(peckRepeatTimeoutRef.current);
      peckRepeatTimeoutRef.current = null;
    }
  }, []);

  const schedulePeckCycle = useCallback(() => {
    if (!isHomeHoveringRef.current || prefersReducedMotion || !enterComplete) {
      peckLoopRunningRef.current = false;
      return;
    }

    void runPeckOnce().then(() => {
      if (!isHomeHoveringRef.current) {
        peckLoopRunningRef.current = false;
        return;
      }

      peckRepeatTimeoutRef.current = setTimeout(() => {
        peckRepeatTimeoutRef.current = null;
        schedulePeckCycle();
      }, HOME_NAV_LOGO_PECK_REPEAT_DELAY_MS);
    });
  }, [enterComplete, prefersReducedMotion, runPeckOnce]);

  const handleHomeMouseEnter = useCallback(() => {
    if (prefersReducedMotion || !enterComplete) {
      return;
    }

    isHomeHoveringRef.current = true;

    if (peckLoopRunningRef.current) {
      return;
    }

    peckLoopRunningRef.current = true;
    schedulePeckCycle();
  }, [enterComplete, prefersReducedMotion, schedulePeckCycle]);

  const handleHomeMouseLeave = useCallback(() => {
    isHomeHoveringRef.current = false;
    peckLoopRunningRef.current = false;
    clearPeckRepeat();
  }, [clearPeckRepeat]);

  useEffect(() => () => clearPeckRepeat(), [clearPeckRepeat]);

  return (
    <div className="flex w-full items-center justify-between">
      <Link
        href="/"
        onMouseEnter={handleHomeMouseEnter}
        onMouseLeave={handleHomeMouseLeave}
        className="flex items-center gap-3 py-3 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
        aria-label="Home"
      >
        <span className="relative block h-9 w-9 shrink-0" aria-hidden>
          <motion.span
            ref={logoRef}
            className="absolute inset-0"
            animate={logoControls}
            initial={false}
          >
            <motion.span
              className="relative block h-full w-full origin-[35%_78%]"
              animate={peckControls}
              initial={{ x: 0, y: 0, rotate: 0 }}
            >
              <Image
                src="/logo.svg"
                alt=""
                fill
                className="object-contain"
                priority
                aria-hidden
              />
            </motion.span>
          </motion.span>
        </span>
        <motion.span
          className="font-sans text-base font-bold uppercase tracking-[0.15em] text-name-gradient"
          animate={textControls}
          initial={enableNavbarEnter ? { opacity: 0, x: peakOffsetPx ?? HOME_NAV_LOGO_PEAK_FALLBACK_PX } : false}
        >
          Vassili Prokopenko
        </motion.span>
      </Link>

      <motion.div
        className="flex items-center gap-3"
        animate={rightControls}
        initial={enableNavbarEnter ? { opacity: 0, y: -HOME_NAV_RIGHT_ENTER_OFFSET_PX } : false}
      >
        <ThemeToggle />
        <Link
          href="/#about"
          onClick={scrollToAbout}
          className="flex items-center gap-[6px] py-3 font-mono text-base uppercase text-text transition-all duration-[60ms] ease-snap hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
        >
          About
          <ArrowRight size={24} strokeWidth={2} aria-hidden />
        </Link>
      </motion.div>
    </div>
  );
};
