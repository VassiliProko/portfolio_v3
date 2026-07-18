'use client';

import React from 'react';
import { HomeNavbar } from '@/src/components/layout/HomeNavbar';
import { DuckIntroSplash } from '@/src/components/ui/duckIntro/DuckIntroSplash';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';

export const ConditionalNav: React.FC = () => {
  const { duckIntroActive, completeDuckIntro } = useHomeEnterAnimation();

  return (
    <>
      <DuckIntroSplash active={duckIntroActive} onComplete={completeDuckIntro} />
      <nav
        className="sticky top-0 z-50 overflow-visible"
        aria-label="Primary"
        hidden={duckIntroActive}
        aria-hidden={duckIntroActive}
      >
        {!duckIntroActive ? <HomeNavbar /> : null}
      </nav>
    </>
  );
};
