'use client';

import React, { useState, useEffect } from 'react';
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

function scrollToPlay(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('play');
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-background">
      <div className={`max-w-[1200px] mx-auto px-5 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
        isScrolled ? 'py-1.5' : 'py-4'
      }`}>
        <div className={`flex justify-between transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
          isScrolled ? 'items-center' : 'items-start'
        }`}>
          {/* Left: Logo/Name Section */}
          <div className={`flex flex-row transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
            isScrolled ? 'items-center gap-3' : 'items-start gap-6'
          }`}>
            <Link
              href="/"
              className={`relative shrink-0 overflow-hidden rounded-lg block focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
                isScrolled ? 'w-[36px] h-[36px]' : 'w-[80px] h-[80px]'
              }`}
              aria-label="Home"
            >
              <Image
                src="/logo.svg"
                alt="Vassili Prokopenko Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
            <div className={`flex flex-col transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
              isScrolled ? 'gap-0' : 'gap-1.5'
            }`}>
              <h1 className={`text-text-muted font-bold leading-tight font-sans transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
                isScrolled ? 'text-base' : 'text-2xl'
              }`}>
                Vassili Prokopenko
              </h1>
              <p className={`text-primary-base text-base font-mono leading-tight transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] overflow-hidden ${
                isScrolled ? 'opacity-0 max-h-0' : 'opacity-100 max-h-8'
              }`}>
                Designer
              </p>
            </div>
          </div>

          {/* Right: Navigation */}
          <nav className={`hidden md:flex flex-row gap-2 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
            isScrolled ? 'items-center' : 'items-start'
          }`}>
            <Link
              href="/#work"
              className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
              onClick={isHome ? scrollToWork : undefined}
            >
              Work
            </Link>
            <Link
              href="/#play"
              className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
              onClick={isHome ? scrollToPlay : undefined}
            >
              Play
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
              <nav className="absolute top-full right-0 mt-4 flex flex-col gap-2 items-end rounded-lg border border-border-base bg-navbar-dropdown py-2 pl-2 pr-3 backdrop-blur-md z-10">
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
                  href="/#play"
                  className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
                  onClick={(e) => {
                    if (isHome) scrollToPlay(e);
                    setIsMenuOpen(false);
                  }}
                >
                  Play
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
