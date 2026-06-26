'use client'

import React from 'react';
import { HomeIntroSection } from '@/src/components/ui/HomeIntroSection';
import { WorkBentoSection } from '@/src/components/layout/WorkBentoSection';
import { AboutSection } from '@/src/components/layout/AboutSection';

export default function HomePage() {
  return (
    <>
      <HomeIntroSection />
      <WorkBentoSection />
      <AboutSection />
    </>
  );
}
