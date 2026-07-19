'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useAnimationControls, useReducedMotion } from 'motion/react';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { MobileNavMenuPanel, MobileNavMenuToggle } from '@/src/components/layout/MobileNavMenu';
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
  HOME_NAV_LOGO_PECK_EASE,
  HOME_NAV_LOGO_PECK_PEAK_AT,
  HOME_NAV_LOGO_PECK_REPEAT_DELAY_MS,
  HOME_NAV_LOGO_PECK_ROTATE,
  HOME_NAV_LOGO_PECK_S,
  HOME_NAV_LOGO_PECK_X,
  HOME_NAV_LOGO_PECK_Y,
  HOME_NAV_RIGHT_ENTER_EASE,
  HOME_NAV_RIGHT_ENTER_OFFSET_PX,
  HOME_NAV_RIGHT_ENTER_S,
} from '@/src/components/ui/homeNavbarMotion';

export const HomeNavbar: React.FC = () => {
  const pathname = usePathname();
  const isAboutPage = pathname === '/about';
  const { enableNavbarEnter, duckIntroActive, notifyNavbarPeak } = useHomeEnterAnimation();
  const prefersReducedMotion = useReducedMotion();
  const enterCompleteRef = useRef(!enableNavbarEnter);
  const isHomeHoveringRef = useRef(false);
  const peckLoopRunningRef = useRef(false);
  const schedulePeckCycleRef = useRef<(() => void) | null>(null);
  const peckRepeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutLinkRef = useRef<HTMLAnchorElement>(null);
  const [isAboutHovering, setIsAboutHovering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const [aboutLinkWidthPx, setAboutLinkWidthPx] = useState(0);
  const showAboutProfile = !isAboutPage && isAboutHovering;

  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }
  const navControls = useAnimationControls();
  const peckControls = useAnimationControls();
  const aboutProfileSizePx =
    aboutLinkWidthPx > 0
      ? Math.round(aboutLinkWidthPx * HOME_NAV_ABOUT_PROFILE_SIZE_MULTIPLIER)
      : 0;

  const shouldEnterFromTop = enableNavbarEnter && !duckIntroActive;

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
        delay: showAboutProfile ? HOME_NAV_ABOUT_PROFILE_DELAY_S : 0,
      };

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!shouldEnterFromTop) {
      if (!enableNavbarEnter) {
        navControls.set({ opacity: 1, y: 0 });
        enterCompleteRef.current = true;
        notifyNavbarPeak();
      }
      return;
    }

    enterCompleteRef.current = false;
    let cancelled = false;

    const runSequence = async () => {
      if (prefersReducedMotion) {
        navControls.set({ opacity: 1, y: 0 });
        notifyNavbarPeak();
        enterCompleteRef.current = true;
        return;
      }

      navControls.set({ opacity: 0, y: -HOME_NAV_RIGHT_ENTER_OFFSET_PX });
      notifyNavbarPeak();

      await navControls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration: HOME_NAV_RIGHT_ENTER_S,
          ease: HOME_NAV_RIGHT_ENTER_EASE,
        },
      });

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
    navControls,
    notifyNavbarPeak,
    prefersReducedMotion,
    shouldEnterFromTop,
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
    [pathname],
  );

  useEffect(() => () => clearPeckRepeat(), [clearPeckRepeat]);

  return (
    <div className="relative">
      <motion.div
        className="relative z-10 flex w-full items-center justify-between bg-background"
        animate={navControls}
        initial={
          enableNavbarEnter
            ? { opacity: 0, y: -HOME_NAV_RIGHT_ENTER_OFFSET_PX }
            : false
        }
      >
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
          </span>
          <span className="font-sans text-base font-bold uppercase tracking-[0.15em] text-name-gradient">
            Vassili Prokopenko
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden min-[787px]:flex min-[787px]:items-center min-[787px]:gap-3">
            <ThemeToggle />
            <div
              className="relative overflow-visible"
              onMouseEnter={() => {
                if (!isAboutPage) {
                  setIsAboutHovering(true);
                }
              }}
              onMouseLeave={() => setIsAboutHovering(false)}
            >
              <Link
                ref={aboutLinkRef}
                href="/about"
                prefetch={false}
                aria-current={isAboutPage ? 'page' : undefined}
                className="type-navigation block py-3 text-text transition-colors duration-[60ms] ease-snap focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
              >
                About
              </Link>

              {!isAboutPage && aboutProfileSizePx > 0 ? (
                <motion.div
                  className="pointer-events-none absolute left-0 top-full z-50 w-max overflow-visible"
                  style={{ paddingTop: HOME_NAV_ABOUT_PROFILE_TOP_GAP_PX }}
                  initial={false}
                animate={{
                  opacity: showAboutProfile ? 1 : 0,
                  x: showAboutProfile
                    ? HOME_NAV_ABOUT_PROFILE_OFFSET_X
                    : HOME_NAV_ABOUT_PROFILE_ENTER_FROM_X,
                  rotate: showAboutProfile
                    ? HOME_NAV_ABOUT_PROFILE_ROTATE
                    : HOME_NAV_ABOUT_PROFILE_ENTER_FROM_ROTATE,
                }}
                transition={aboutProfileTransition}
                aria-hidden={!showAboutProfile}
                >
                  <Image
                    src={HOME_NAV_ABOUT_PROFILE_SRC}
                    alt=""
                    width={aboutProfileSizePx}
                    height={aboutProfileSizePx}
                    className="aspect-square block max-w-none rounded-lg object-cover object-center shadow-about-profile-stamp"
                    sizes={`${aboutProfileSizePx}px`}
                  />
                </motion.div>
              ) : null}
            </div>
          </div>

          <MobileNavMenuToggle
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen((open) => !open)}
            className="min-[787px]:hidden"
          />
        </div>
      </motion.div>

      <MobileNavMenuPanel
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAboutPage={isAboutPage}
      />
    </div>
  );
};
