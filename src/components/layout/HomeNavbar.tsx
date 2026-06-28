'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useAnimationControls, useReducedMotion } from 'motion/react';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';
import {
  HOME_NAV_ABOUT_PROFILE_DELAY_S,
  HOME_NAV_ABOUT_PROFILE_ENTER_FROM_ROTATE,
  HOME_NAV_ABOUT_PROFILE_ENTER_FROM_X,
  HOME_NAV_ABOUT_PROFILE_ENTER_S,
  HOME_NAV_ABOUT_PROFILE_OFFSET_X,
  HOME_NAV_ABOUT_PROFILE_ROTATE,
  HOME_NAV_ABOUT_PROFILE_SIZE_MULTIPLIER,
  HOME_NAV_ABOUT_PROFILE_SRC,
  HOME_NAV_ABOUT_PROFILE_TOP_GAP_PX,
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

function measureLogoPeakOffset(logoEl: HTMLElement) {
  return logoEl.offsetWidth * HOME_NAV_LOGO_PEAK_WIDTH_MULTIPLIER;
}

export const HomeNavbar: React.FC = () => {
  const pathname = usePathname();
  const { enableNavbarEnter, readyForReveal, notifyNavbarPeak } = useHomeEnterAnimation();
  const prefersReducedMotion = useReducedMotion();
  const logoRef = useRef<HTMLSpanElement>(null);
  const enterCompleteRef = useRef(!enableNavbarEnter);
  const isHomeHoveringRef = useRef(false);
  const peckLoopRunningRef = useRef(false);
  const readyForRevealRef = useRef(readyForReveal);
  const schedulePeckCycleRef = useRef<(() => void) | null>(null);
  const peckRepeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutLinkRef = useRef<HTMLAnchorElement>(null);
  const [isAboutHovering, setIsAboutHovering] = useState(false);
  const [aboutLinkWidthPx, setAboutLinkWidthPx] = useState(0);
  const logoControls = useAnimationControls();
  const peckControls = useAnimationControls();
  const textControls = useAnimationControls();
  const rightControls = useAnimationControls();
  const aboutProfileSizePx =
    aboutLinkWidthPx > 0
      ? Math.round(aboutLinkWidthPx * HOME_NAV_ABOUT_PROFILE_SIZE_MULTIPLIER)
      : 0;

  useLayoutEffect(() => {
    const aboutLink = aboutLinkRef.current;
    if (!aboutLink) {
      return;
    }

    const updateWidth = () => {
      setAboutLinkWidthPx(aboutLink.offsetWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(aboutLink);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const aboutProfileTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: HOME_NAV_ABOUT_PROFILE_ENTER_S,
        ease: HOME_NAV_RIGHT_ENTER_EASE,
        delay: isAboutHovering ? HOME_NAV_ABOUT_PROFILE_DELAY_S : 0,
      };

  useEffect(() => {
    readyForRevealRef.current = readyForReveal;
  }, [readyForReveal]);

  useEffect(() => {
    if (!enableNavbarEnter) {
      logoControls.set({ x: 0 });
      textControls.set({ opacity: 1, x: 0 });
      rightControls.set({ opacity: 1, y: 0 });
      enterCompleteRef.current = true;
      return;
    }

    enterCompleteRef.current = false;

    let cancelled = false;
    const peakOffsetPx = logoRef.current
      ? measureLogoPeakOffset(logoRef.current)
      : HOME_NAV_LOGO_PEAK_FALLBACK_PX;

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

      if (!readyForRevealRef.current) {
        await new Promise<void>((resolve) => {
          const poll = () => {
            if (cancelled || readyForRevealRef.current) {
              resolve();
              return;
            }

            window.requestAnimationFrame(poll);
          };
          poll();
        });
      }

      if (cancelled) {
        return;
      }

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
        enterCompleteRef.current = true;
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
    readyForReveal,
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
    if (!isHomeHoveringRef.current || prefersReducedMotion || !enterCompleteRef.current) {
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
        schedulePeckCycleRef.current?.();
      }, HOME_NAV_LOGO_PECK_REPEAT_DELAY_MS);
    });
  }, [prefersReducedMotion, runPeckOnce]);

  useEffect(() => {
    schedulePeckCycleRef.current = schedulePeckCycle;
  }, [schedulePeckCycle]);

  const handleHomeMouseEnter = useCallback(() => {
    if (prefersReducedMotion || !enterCompleteRef.current) {
      return;
    }

    isHomeHoveringRef.current = true;

    if (peckLoopRunningRef.current) {
      return;
    }

    peckLoopRunningRef.current = true;
    schedulePeckCycle();
  }, [prefersReducedMotion, schedulePeckCycle]);

  const handleHomeMouseLeave = useCallback(() => {
    isHomeHoveringRef.current = false;
    peckLoopRunningRef.current = false;
    clearPeckRepeat();
  }, [clearPeckRepeat]);

  const handleHomeClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== '/' || window.scrollY <= 0) {
        return;
      }

      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pathname]
  );

  useEffect(() => () => clearPeckRepeat(), [clearPeckRepeat]);

  return (
    <div className="flex w-full items-center justify-between">
      <Link
        href="/"
        prefetch={false}
        onClick={handleHomeClick}
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
          initial={enableNavbarEnter ? { opacity: 0, x: HOME_NAV_LOGO_PEAK_FALLBACK_PX } : false}
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
        <div
          className="relative overflow-visible"
          onMouseEnter={() => setIsAboutHovering(true)}
          onMouseLeave={() => setIsAboutHovering(false)}
        >
          <Link
            ref={aboutLinkRef}
            href="/about"
            prefetch={false}
            className="block py-3 font-mono text-base uppercase text-text transition-colors duration-[60ms] ease-snap focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
          >
            About
          </Link>

          {aboutProfileSizePx > 0 ? (
            <motion.div
              className="pointer-events-none absolute left-0 top-full z-50 w-max overflow-visible"
              style={{ paddingTop: HOME_NAV_ABOUT_PROFILE_TOP_GAP_PX }}
              initial={false}
              animate={{
                opacity: isAboutHovering ? 1 : 0,
                x: isAboutHovering
                  ? HOME_NAV_ABOUT_PROFILE_OFFSET_X
                  : HOME_NAV_ABOUT_PROFILE_ENTER_FROM_X,
                rotate: isAboutHovering
                  ? HOME_NAV_ABOUT_PROFILE_ROTATE
                  : HOME_NAV_ABOUT_PROFILE_ENTER_FROM_ROTATE,
              }}
              transition={aboutProfileTransition}
              aria-hidden={!isAboutHovering}
            >
              <Image
                src={HOME_NAV_ABOUT_PROFILE_SRC}
                alt=""
                width={aboutProfileSizePx}
                height={aboutProfileSizePx}
                className="block max-w-none rounded-lg object-cover shadow-about-profile-stamp"
                sizes={`${aboutProfileSizePx}px`}
              />
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};
