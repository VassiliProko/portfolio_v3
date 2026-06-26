'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { HomeNavbar } from '@/src/components/layout/HomeNavbar';

const CASE_STUDY_PATHS = ['/mcss', '/prettify-minerva', '/usthing', '/applicable'];

// hides the navbar on case study pages

export const ConditionalNav: React.FC = () => {
  const pathname = usePathname();
  const isCaseStudy = CASE_STUDY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isCaseStudy) {
    return null;
  }

  return (
    <nav
      className="sticky top-0 z-50 flex w-full items-center justify-between"
      aria-label="Primary"
    >
      <HomeNavbar />
    </nav>
  );
};
