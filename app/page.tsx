'use client';

import React, { useState } from 'react';
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

export default function HomePage() {
  const { isReturnHomeVisit } = useHomeEnterAnimation();
  const returnReveal = useMountPopdownReveal();
  const [firstVisitShowcaseVisible, setFirstVisitShowcaseVisible] = useState(false);

  const showcaseVisible = isReturnHomeVisit ? returnReveal : firstVisitShowcaseVisible;

  return (
    <>
      <HomeIntroSection
        returnReveal={returnReveal}
        onHeadlineComplete={() => setFirstVisitShowcaseVisible(true)}
      />
      <WorkShowcaseSection visible={showcaseVisible} unifiedReveal={isReturnHomeVisit} />
    </>
  );
}
