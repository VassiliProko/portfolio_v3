'use client';

import React, { useState } from 'react';
import { HomeIntroSection } from '@/src/components/ui/HomeIntroSection';
import { HighlightReelSection } from '@/src/components/layout/HighlightReelSection';
import { WorkBentoSection } from '@/src/components/layout/WorkBentoSection';
import { AboutSection } from '@/src/components/layout/AboutSection';

export default function HomePage() {
  const [introSecondaryVisible, setIntroSecondaryVisible] = useState(false);

  return (
    <>
      <HomeIntroSection onHeadlineComplete={() => setIntroSecondaryVisible(true)} />
      <HighlightReelSection visible={introSecondaryVisible} />
      <WorkBentoSection />
      <AboutSection />
    </>
  );
}
