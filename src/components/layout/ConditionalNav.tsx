'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { HomeNavbar } from '@/src/components/layout/HomeNavbar';
import { isCaseStudyPath } from '@/src/constants/caseStudyPaths';

// hides the navbar on case study pages

export const ConditionalNav: React.FC = () => {
  const pathname = usePathname();
  const isCaseStudy = isCaseStudyPath(pathname);

  if (isCaseStudy) {
    return null;
  }

  return (
    <nav
      className="sticky top-0 z-50"
      aria-label="Primary"
    >
      <HomeNavbar />
    </nav>
  );
};
