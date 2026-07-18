'use client';

import React, { useLayoutEffect } from 'react';
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
} from '@/src/utils/theme';

/**
 * Re-applies the resolved theme after hydration so React cannot leave a stale
 * light/dark class, and keeps system preference in sync when nothing is stored.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    applyTheme(resolveTheme(), { animate: false });

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if (getStoredTheme() === null) {
        applyTheme(getSystemTheme(), { animate: false });
      }
    };
    media.addEventListener('change', onSystemChange);

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        applyTheme(resolveTheme(), { animate: false });
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      media.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return children;
}
