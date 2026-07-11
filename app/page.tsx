'use client';

import React, { useState } from 'react';
import { HomeIntroSection } from '@/src/components/ui/HomeIntroSection';
import { WorkShowcaseSection } from '@/src/components/layout/WorkShowcaseSection';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';
import { useMountPopdownReveal } from '@/src/components/ui/PopdownReveal';

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
