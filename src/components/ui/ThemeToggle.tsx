'use client';

import React, { useSyncExternalStore } from 'react';
import { Moon, Sun } from '@phosphor-icons/react';
import { cn } from '@/src/utils/cn';
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setStoredTheme,
  subscribeTheme,
  type Theme,
} from '@/src/utils/theme';

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setStoredTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex items-center justify-center py-3 text-text opacity-100 transition-opacity duration-medium ease-move hover:opacity-60 motion-reduce:transition-none focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
        className,
      )}
    >
      {theme === 'dark' ? (
        <Sun size={24} aria-hidden />
      ) : (
        <Moon size={24} aria-hidden />
      )}
    </button>
  );
};
