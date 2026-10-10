'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';

type HomeEntryMode = 'full' | 'return' | null;

type HomeEnterAnimationContextValue = {
  introBlurReady: boolean;
  mainContentVisible: boolean;
  enableNavbarEnter: boolean;
  readyForReveal: boolean;
  duckIntroActive: boolean;
  homeEntryMode: HomeEntryMode;
  isReturnHomeVisit: boolean;
  notifyNavbarPeak: () => void;
  completeDuckIntro: () => void;
};

const HomeEnterAnimationContext = createContext<HomeEnterAnimationContextValue | null>(null);

// Preserve the full splash only for the initial home entry, not SPA returns.
let homeEntryConsumed = false;
const notifyNavbarPeak = () => {};

function resolveHomeEntryMode(isHomeRoute: boolean, prefersReducedMotion: boolean | null): HomeEntryMode {
  if (!isHomeRoute) return null;
  return prefersReducedMotion || homeEntryConsumed ? 'return' : 'full';
}

export function HomeEnterAnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isHomeRoute = pathname === '/';
  const [homeEntryMode, setHomeEntryMode] = useState<HomeEntryMode>(() =>
    resolveHomeEntryMode(isHomeRoute, prefersReducedMotion),
  );
  const [trackedPathname, setTrackedPathname] = useState(pathname);
  const [duckIntroComplete, setDuckIntroComplete] = useState(false);

  if (pathname !== trackedPathname) {
    setTrackedPathname(pathname);
    setHomeEntryMode(resolveHomeEntryMode(isHomeRoute, prefersReducedMotion));
  }

  useEffect(() => {
    if (!isHomeRoute) homeEntryConsumed = true;
  }, [isHomeRoute]);

  const enableNavbarEnter = homeEntryMode === 'full';
  const duckIntroActive = enableNavbarEnter && !prefersReducedMotion && !duckIntroComplete;
  const completeDuckIntro = useCallback(() => setDuckIntroComplete(true), []);

  // Reveal the navbar, text, and cards together as soon as the splash finishes.
  // window.load includes unrelated media and must never hold the content hidden.
  const visible = !duckIntroActive;
  const value = useMemo(() => ({
    introBlurReady: visible,
    mainContentVisible: visible,
    enableNavbarEnter,
    readyForReveal: true,
    duckIntroActive,
    homeEntryMode,
    isReturnHomeVisit: homeEntryMode === 'return',
    notifyNavbarPeak,
    completeDuckIntro,
  }), [visible, enableNavbarEnter, duckIntroActive, homeEntryMode, completeDuckIntro]);

  return (
    <HomeEnterAnimationContext.Provider value={value}>
      {children}
    </HomeEnterAnimationContext.Provider>
  );
}

export function useHomeEnterAnimation() {
  const context = useContext(HomeEnterAnimationContext);
  if (!context) throw new Error('useHomeEnterAnimation must be used within HomeEnterAnimationProvider');
  return context;
}
