'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/src/components/layout/Header';

const CASE_STUDY_PATHS = ['/mcss', '/prettify-minerva'];

export const ConditionalHeader: React.FC = () => {
  const pathname = usePathname();
  const isCaseStudy = CASE_STUDY_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'));

  if (isCaseStudy) {
    return null;
  }

  return (
    <>
      {/* Spacer above header */}
      <div className="h-[78px] bg-background" aria-hidden />
      <Header />
    </>
  );
};
