'use client';

import React, { useState } from 'react';
import { HomeIntroSection } from '@/src/components/ui/HomeIntroSection';
import { WorkShowcaseSection } from '@/src/components/layout/WorkShowcaseSection';

export default function HomePage() {
  const [showcaseVisible, setShowcaseVisible] = useState(false);

  return (
    <>
      <HomeIntroSection onHeadlineComplete={() => setShowcaseVisible(true)} />
      <WorkShowcaseSection visible={showcaseVisible} />
    </>
  );
}
