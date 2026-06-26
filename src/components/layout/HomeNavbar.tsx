'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useAnimationControls } from 'motion/react';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';
import {
  HOME_NAV_ENTER_EASE,
  HOME_NAV_LOGO_OUTBOUND_S,
  HOME_NAV_LOGO_PEAK_FALLBACK_PX,
  HOME_NAV_LOGO_PEAK_WIDTH_MULTIPLIER,
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
  const logoRef = useRef<HTMLSpanElement>(null);
  const [peakOffsetPx, setPeakOffsetPx] = useState<number | null>(null);
  const logoControls = useAnimationControls();
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
      return;
    }

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

  return (
    <div className="flex w-full items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-3 py-3 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
        aria-label="Home"
      >
        <motion.span
          ref={logoRef}
          className="relative block h-9 w-9 shrink-0"
          animate={logoControls}
          initial={false}
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
