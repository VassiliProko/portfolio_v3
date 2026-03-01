'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

function scrollToWork(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('work');
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToAbout(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('about');
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="w-full bg-background top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-5 py-4">
        <div className="flex items-start justify-between">
          {/* Left: Logo/Name Section - Flex Row Container */}
          <div className="flex flex-row items-start gap-6">
            {/* Col 1: SVG Logo */}
            <div className="relative w-[80px] h-[80px] shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/logo.svg"
                alt="Vassili Prokopenko Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Col 2: Flex Col Container */}
            <div className="flex flex-col gap-1.5">
              <h1 className="text-text-muted font-bold text-2xl leading-tight font-sans">
                Vassili Prokopenko
              </h1>
              <p className="text-primary-base text-base font-mono leading-tight">
                Designer
              </p>
            </div>
          </div>

          {/* Right: Navigation - Aligned to top with padding above */}
          <nav className="hidden md:flex flex-row items-start gap-2">
            <Link
              href="/#work"
              className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
              onClick={isHome ? scrollToWork : undefined}
            >
              Work
            </Link>
            <Link
              href="/art"
              className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
            >
              Art
            </Link> 
            <Link
              href="/#about"
              className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
              onClick={isHome ? scrollToAbout : undefined}
            >
              About
            </Link>
          </nav>

          {/* Mobile: hamburger + dropdown column */}
          <div className="md:hidden relative flex flex-col items-end">
            <button
              className="p-2 text-text focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X size={20} strokeWidth={2} />
              ) : (
                <Menu size={20} strokeWidth={2} />
              )}
            </button>
            {isMenuOpen && (
              <nav className="absolute top-full right-0 mt-2 flex flex-col gap-2 items-end rounded-lg border border-border-base bg-navbar-dropdown py-2 pl-2 pr-3 backdrop-blur-md z-10">
                <Link
                  href="/#work"
                  className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
                  onClick={(e) => {
                    if (isHome) scrollToWork(e);
                    setIsMenuOpen(false);
                  }}
                >
                  Work
                </Link>
                <Link
                  href="/art"
                  className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Art
                </Link>
                <Link
                  href="/#about"
                  className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
                  onClick={(e) => {
                    if (isHome) scrollToAbout(e);
                    setIsMenuOpen(false);
                  }}
                >
                  About
                </Link>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
