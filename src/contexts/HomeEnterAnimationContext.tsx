'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { isCaseStudyPath } from '@/src/constants/caseStudyPaths';

type HomeEnterAnimationContextValue = {
  introBlurReady: boolean;
  mainContentVisible: boolean;
  enableNavbarEnter: boolean;
  readyForReveal: boolean;
  notifyNavbarPeak: () => void;
};

const HomeEnterAnimationContext = createContext<HomeEnterAnimationContextValue | null>(null);

type HomeEnterState = {
  readyForReveal: boolean;
  navbarPeaked: boolean;
  introBlurReady: boolean;
  mainContentVisible: boolean;
};

type HomeEnterAction =
  | { type: 'RESET'; readyForReveal: boolean; enableNavbarEnter: boolean }
  | { type: 'PAGE_LOADED'; enableNavbarEnter: boolean }
  | { type: 'NAVBAR_PEAK'; enableNavbarEnter: boolean };

function deriveVisibility(state: HomeEnterState, enableNavbarEnter: boolean): HomeEnterState {
  const visible = !enableNavbarEnter || (state.navbarPeaked && state.readyForReveal);
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
        introBlurReady: !action.enableNavbarEnter,
        mainContentVisible: !action.enableNavbarEnter,
      };
      return deriveVisibility(next, action.enableNavbarEnter);
    }
    case 'PAGE_LOADED':
      return deriveVisibility({ ...state, readyForReveal: true }, action.enableNavbarEnter);
    case 'NAVBAR_PEAK':
      return deriveVisibility({ ...state, navbarPeaked: true }, action.enableNavbarEnter);
    default:
      return state;
  }
}

export function HomeEnterAnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isHomeRoute = pathname === '/';
  const showNavbar = !isCaseStudyPath(pathname);
  const enableNavbarEnter = showNavbar && isHomeRoute && !prefersReducedMotion;
  const initialReady =
    !enableNavbarEnter || (typeof document !== 'undefined' && document.readyState === 'complete');
  const [state, dispatch] = useReducer(homeEnterReducer, {
    readyForReveal: initialReady,
    navbarPeaked: false,
    introBlurReady: !enableNavbarEnter,
    mainContentVisible: !enableNavbarEnter,
  });

  useEffect(() => {
    const readyNow =
      !enableNavbarEnter || (typeof document !== 'undefined' && document.readyState === 'complete');
    dispatch({ type: 'RESET', readyForReveal: readyNow, enableNavbarEnter });
  }, [enableNavbarEnter, pathname]);

  useEffect(() => {
    if (!enableNavbarEnter || state.readyForReveal) {
      return;
    }

    const handleLoad = () => dispatch({ type: 'PAGE_LOADED', enableNavbarEnter });
    window.addEventListener('load', handleLoad, { once: true });

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [enableNavbarEnter, state.readyForReveal]);

  const notifyNavbarPeak = useCallback(() => {
    dispatch({ type: 'NAVBAR_PEAK', enableNavbarEnter });
  }, [enableNavbarEnter]);

  const value = useMemo(
    () => ({
      introBlurReady: state.introBlurReady,
      mainContentVisible: state.mainContentVisible,
      enableNavbarEnter,
      readyForReveal: state.readyForReveal,
      notifyNavbarPeak,
    }),
    [
      state.introBlurReady,
      state.mainContentVisible,
      state.readyForReveal,
      enableNavbarEnter,
      notifyNavbarPeak,
    ]
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
