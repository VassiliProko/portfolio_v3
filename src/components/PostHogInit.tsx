'use client';

import { useEffect } from 'react';
import { initPostHog } from '@/src/utils/analytics';

export function PostHogInit() {
  useEffect(() => {
    // Keep analytics parsing and recording setup out of the first paint.
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => { void initPostHog(); }, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => { void initPostHog(); }, 1000);
    return () => clearTimeout(id);
  }, []);

  return null;
}
