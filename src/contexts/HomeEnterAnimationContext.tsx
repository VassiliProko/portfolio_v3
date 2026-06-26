'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';

type HomeEnterAnimationContextValue = {
  introBlurReady: boolean;
  enableNavbarEnter: boolean;
  notifyNavbarPeak: () => void;
};

const HomeEnterAnimationContext = createContext<HomeEnterAnimationContextValue | null>(null);

export function HomeEnterAnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isHome = pathname === '/';
  const enableNavbarEnter = isHome && !prefersReducedMotion;
  const [introBlurReady, setIntroBlurReady] = useState(!enableNavbarEnter);

  useEffect(() => {
    setIntroBlurReady(!enableNavbarEnter);
  }, [enableNavbarEnter]);

  const notifyNavbarPeak = useCallback(() => {
    setIntroBlurReady(true);
  }, []);

  const value = useMemo(
    () => ({
      introBlurReady,
      enableNavbarEnter,
      notifyNavbarPeak,
    }),
    [introBlurReady, enableNavbarEnter, notifyNavbarPeak]
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
