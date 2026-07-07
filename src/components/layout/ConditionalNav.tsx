'use client';

import React from 'react';
import { HomeNavbar } from '@/src/components/layout/HomeNavbar';

export const ConditionalNav: React.FC = () => {
  return (
    <nav
      className="sticky top-0 z-50 overflow-visible"
      aria-label="Primary"
    >
      <HomeNavbar />
    </nav>
  );
};
