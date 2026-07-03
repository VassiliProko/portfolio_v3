export const THEME_STORAGE_KEY = 'theme';
export const THEME_TRANSITION_MS = 300;

export type Theme = 'light' | 'dark';

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  return null;
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

let themeTransitionTimeout: ReturnType<typeof setTimeout> | undefined;

export function applyTheme(theme: Theme, options?: { animate?: boolean }) {
  const root = document.documentElement;
  const shouldAnimate =
    options?.animate !== false &&
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (themeTransitionTimeout) {
    clearTimeout(themeTransitionTimeout);
    themeTransitionTimeout = undefined;
  }

  if (shouldAnimate) {
    root.classList.add('theme-transition');
  } else {
    root.classList.remove('theme-transition');
  }

  root.classList.toggle('dark', theme === 'dark');

  if (shouldAnimate) {
    themeTransitionTimeout = setTimeout(() => {
      root.classList.remove('theme-transition');
      themeTransitionTimeout = undefined;
    }, THEME_TRANSITION_MS);
  }
}
