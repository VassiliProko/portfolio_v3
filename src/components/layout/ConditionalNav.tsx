'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HomeNavbar } from '@/src/components/layout/HomeNavbar';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';

const DuckIntroSplash = dynamic(() =>
  import('@/src/components/ui/duckIntro/DuckIntroSplash').then((mod) => mod.DuckIntroSplash),
);

export const ConditionalNav: React.FC = () => {
  const { duckIntroActive, completeDuckIntro } = useHomeEnterAnimation();

  return (
    <>
      {duckIntroActive ? (
        <DuckIntroSplash active={duckIntroActive} onComplete={completeDuckIntro} />
      ) : null}
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
