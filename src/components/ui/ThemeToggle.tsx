'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { applyTheme, resolveTheme, THEME_STORAGE_KEY, type Theme } from '@/src/utils/theme';

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(resolveTheme());
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle color theme'}
      className={cn(
        'flex items-center justify-center py-3 text-text opacity-100 transition-opacity duration-[180ms] ease-move hover:opacity-60 motion-reduce:transition-none focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
        className,
      )}
    >
      {mounted && theme === 'dark' ? (
        <Sun size={24} strokeWidth={2} aria-hidden />
      ) : (
        <Moon size={24} strokeWidth={2} aria-hidden />
      )}
    </button>
  );
};
