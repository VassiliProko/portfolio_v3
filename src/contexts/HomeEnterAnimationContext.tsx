'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';

type HomeEntryMode = 'full' | 'return' | null;

type HomeEnterAnimationContextValue = {
  introBlurReady: boolean;
  mainContentVisible: boolean;
  enableNavbarEnter: boolean;
  readyForReveal: boolean;
  /** Full-screen duck dither splash (first home entry) */
  duckIntroActive: boolean;
  /** `full` = first site entry on home; `return` = already on site, navigating home */
  homeEntryMode: HomeEntryMode;
  isReturnHomeVisit: boolean;
  notifyNavbarPeak: () => void;
  completeDuckIntro: () => void;
};

const HomeEnterAnimationContext = createContext<HomeEnterAnimationContextValue | null>(null);

/**
 * Survives SPA navigations; resets on full page reload.
 * Set when leaving home (or landing on a non-home route) so Strict Mode remounts
 * of the first home visit still get the full entry sequence.
 */
let homeEntryConsumed = false;

type HomeEnterState = {
  readyForReveal: boolean;
  navbarPeaked: boolean;
  duckIntroComplete: boolean;
  introBlurReady: boolean;
  mainContentVisible: boolean;
};

type HomeEnterAction =
  | {
      type: 'RESET';
      readyForReveal: boolean;
      enableNavbarEnter: boolean;
      skipDuckIntro: boolean;
    }
  | { type: 'PAGE_LOADED'; enableNavbarEnter: boolean; skipDuckIntro: boolean }
  | { type: 'NAVBAR_PEAK'; enableNavbarEnter: boolean; skipDuckIntro: boolean }
  | { type: 'DUCK_INTRO_COMPLETE'; enableNavbarEnter: boolean; skipDuckIntro: boolean };

function deriveVisibility(
  state: HomeEnterState,
  enableNavbarEnter: boolean,
  skipDuckIntro: boolean,
): HomeEnterState {
  const duckReady = skipDuckIntro || state.duckIntroComplete;
  const visible =
    !enableNavbarEnter || (duckReady && state.navbarPeaked && state.readyForReveal);
  return {
    ...state,
    introBlurReady: visible,
    mainContentVisible: visible,
  };
}

function homeEnterReducer(state: HomeEnterState, action: HomeEnterAction): HomeEnterState {
  switch (action.type) {
    case 'RESET': {
      const next = {
        readyForReveal: action.readyForReveal,
        navbarPeaked: false,
        duckIntroComplete: action.skipDuckIntro,
        introBlurReady: !action.enableNavbarEnter,
        mainContentVisible: !action.enableNavbarEnter,
      };
      return deriveVisibility(next, action.enableNavbarEnter, action.skipDuckIntro);
    }
    case 'PAGE_LOADED':
      return deriveVisibility(
        { ...state, readyForReveal: true },
        action.enableNavbarEnter,
        action.skipDuckIntro,
      );
    case 'NAVBAR_PEAK':
      return deriveVisibility(
        { ...state, navbarPeaked: true },
        action.enableNavbarEnter,
        action.skipDuckIntro,
      );
    case 'DUCK_INTRO_COMPLETE':
      return deriveVisibility(
        { ...state, duckIntroComplete: true },
        action.enableNavbarEnter,
        action.skipDuckIntro,
      );
    default:
      return state;
  }
}

function resolveHomeEntryMode(
  isHomeRoute: boolean,
  prefersReducedMotion: boolean | null,
): HomeEntryMode {
  if (!isHomeRoute) {
    return null;
  }
  if (prefersReducedMotion || homeEntryConsumed) {
    return 'return';
  }
  return 'full';
}

export function HomeEnterAnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isHomeRoute = pathname === '/';

  const [homeEntryMode, setHomeEntryMode] = useState<HomeEntryMode>(() =>
    resolveHomeEntryMode(isHomeRoute, prefersReducedMotion),
  );
  const [trackedPathname, setTrackedPathname] = useState(pathname);

  // Sync entry mode as soon as the route changes (before paint) so return visits
  // never flash the first-load blur / navbar sequence.
  if (pathname !== trackedPathname) {
    setTrackedPathname(pathname);
    if (pathname !== '/') {
      setHomeEntryMode(null);
    } else {
      setHomeEntryMode(resolveHomeEntryMode(true, prefersReducedMotion));
    }
  }

  // Landing on a non-home route on first load also consumes full home entry.
  useEffect(() => {
    if (!isHomeRoute) {
      homeEntryConsumed = true;
    }
  }, [isHomeRoute]);

  const enableNavbarEnter = homeEntryMode === 'full';
  const skipDuckIntro = !enableNavbarEnter || Boolean(prefersReducedMotion);
  const initialReady =
    !enableNavbarEnter || (typeof document !== 'undefined' && document.readyState === 'complete');
  const [state, dispatch] = useReducer(homeEnterReducer, {
    readyForReveal: initialReady,
    navbarPeaked: false,
    duckIntroComplete: skipDuckIntro,
    introBlurReady: !enableNavbarEnter,
    mainContentVisible: !enableNavbarEnter,
  });

  useEffect(() => {
    const readyNow =
      !enableNavbarEnter || (typeof document !== 'undefined' && document.readyState === 'complete');
    dispatch({
      type: 'RESET',
      readyForReveal: readyNow,
      enableNavbarEnter,
      skipDuckIntro,
    });
  }, [enableNavbarEnter, pathname, homeEntryMode, skipDuckIntro]);

  useEffect(() => {
    if (!enableNavbarEnter || state.readyForReveal) {
      return;
    }

    const handleLoad = () =>
      dispatch({ type: 'PAGE_LOADED', enableNavbarEnter, skipDuckIntro });
    window.addEventListener('load', handleLoad, { once: true });

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [enableNavbarEnter, skipDuckIntro, state.readyForReveal]);

  const notifyNavbarPeak = useCallback(() => {
    dispatch({ type: 'NAVBAR_PEAK', enableNavbarEnter, skipDuckIntro });
  }, [enableNavbarEnter, skipDuckIntro]);

  const completeDuckIntro = useCallback(() => {
    dispatch({ type: 'DUCK_INTRO_COMPLETE', enableNavbarEnter, skipDuckIntro });
  }, [enableNavbarEnter, skipDuckIntro]);

  const duckIntroActive = enableNavbarEnter && !skipDuckIntro && !state.duckIntroComplete;

  const value = useMemo(
    () => ({
      introBlurReady: state.introBlurReady,
      mainContentVisible: state.mainContentVisible,
      enableNavbarEnter,
      readyForReveal: state.readyForReveal,
      duckIntroActive,
      homeEntryMode,
      isReturnHomeVisit: homeEntryMode === 'return',
      notifyNavbarPeak,
      completeDuckIntro,
    }),
    [
      state.introBlurReady,
      state.mainContentVisible,
      state.readyForReveal,
      enableNavbarEnter,
      duckIntroActive,
      homeEntryMode,
      notifyNavbarPeak,
      completeDuckIntro,
    ],
  );

  return (
    <HomeEnterAnimationContext.Provider value={value}>{children}</HomeEnterAnimationContext.Provider>
  );
}

export function useHomeEnterAnimation() {
  const context = useContext(HomeEnterAnimationContext);
  if (!context) {
    throw new Error('useHomeEnterAnimation must be used within HomeEnterAnimationProvider');
  }
  return context;
}
