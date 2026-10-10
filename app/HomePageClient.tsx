'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HomeIntroSection } from '@/src/components/ui/HomeIntroSection';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';
import { useMountPopdownReveal } from '@/src/components/ui/PopdownReveal';

const WorkShowcaseSection = dynamic(
  () =>
    import('@/src/components/layout/WorkShowcaseSection').then(
      (mod) => mod.WorkShowcaseSection,
    ),
);

export default function HomePageClient() {
  const { introBlurReady, isReturnHomeVisit } = useHomeEnterAnimation();
  const returnReveal = useMountPopdownReveal();

  const showcaseVisible = isReturnHomeVisit ? returnReveal : introBlurReady;

  return (
    <>
      <HomeIntroSection returnReveal={returnReveal} />
      <WorkShowcaseSection visible={showcaseVisible} unifiedReveal={isReturnHomeVisit} />
    </>
  );
}
