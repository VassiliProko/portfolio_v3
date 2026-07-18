export const THEME_STORAGE_KEY = 'theme';
export const THEME_TRANSITION_MS = 300;

export type Theme = 'light' | 'dark';

const themeListeners = new Set<() => void>();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

export function subscribeTheme(onStoreChange: () => void): () => void {
  themeListeners.add(onStoreChange);
  return () => {
    themeListeners.delete(onStoreChange);
  };
}

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

/** Snapshot for useSyncExternalStore — always the resolved effective theme. */
export function getThemeSnapshot(): Theme {
  return resolveTheme();
}

const SERVER_THEME_SNAPSHOT: Theme = 'light';

export function getServerThemeSnapshot(): Theme {
  return SERVER_THEME_SNAPSHOT;
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
  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';

  if (shouldAnimate) {
    themeTransitionTimeout = setTimeout(() => {
      root.classList.remove('theme-transition');
      themeTransitionTimeout = undefined;
    }, THEME_TRANSITION_MS);
  }

  emitThemeChange();
}

export function setStoredTheme(theme: Theme, options?: { animate?: boolean }) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme, options);
}
