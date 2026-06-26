'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { isCaseStudyPath } from '@/src/constants/caseStudyPaths';

type HomeEnterAnimationContextValue = {
  introBlurReady: boolean;
  mainContentVisible: boolean;
  enableNavbarEnter: boolean;
  notifyNavbarPeak: () => void;
};

const HomeEnterAnimationContext = createContext<HomeEnterAnimationContextValue | null>(null);

export function HomeEnterAnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const showNavbar = !isCaseStudyPath(pathname);
  const enableNavbarEnter = showNavbar && !prefersReducedMotion;
  const [introBlurReady, setIntroBlurReady] = useState(!enableNavbarEnter);
  const [mainContentVisible, setMainContentVisible] = useState(!enableNavbarEnter);

  useEffect(() => {
    setIntroBlurReady(!enableNavbarEnter);
    setMainContentVisible(!enableNavbarEnter);
  }, [enableNavbarEnter, pathname]);

  const notifyNavbarPeak = useCallback(() => {
    setIntroBlurReady(true);
    setMainContentVisible(true);
  }, []);

  const value = useMemo(
    () => ({
      introBlurReady,
      mainContentVisible,
      enableNavbarEnter,
      notifyNavbarPeak,
    }),
    [introBlurReady, mainContentVisible, enableNavbarEnter, notifyNavbarPeak]
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
