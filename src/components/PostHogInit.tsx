'use client';

import { useEffect } from 'react';
import { initPostHog } from '@/src/utils/analytics';

export function PostHogInit() {
  useEffect(() => {
    initPostHog();
  }, []);

  return null;
}
