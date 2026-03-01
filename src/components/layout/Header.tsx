'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              href="/work"
              className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
            >
              Work
            </Link>
            <Link
              href="/play"
              className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
            >
              Art
            </Link>
            <Link
              href="/about"
              className="px-2 py-1.5 text-text text-base font-mono leading-tight hover:inline hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-all duration-200"
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
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
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 bg-surface-1 p-2 rounded-lg">
            <Link
              href="/work"
              className="px-2 py-1.5 rounded-sm bg-surface-2 text-text text-base font-mono leading-tight hover:bg-surface-3 transition-colors duration-[60ms] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
              onClick={() => setIsMenuOpen(false)}
            >
              Work
            </Link>
            <Link
              href="/play"
              className="px-2 py-1.5 rounded-sm bg-surface-2 text-text text-base font-mono leading-tight hover:bg-surface-3 transition-colors duration-[60ms] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
              onClick={() => setIsMenuOpen(false)}
            >
              Play
            </Link>
            <Link
              href="/about"
              className="px-2 py-1.5 rounded-sm bg-surface-2 text-text text-base font-mono leading-tight hover:bg-surface-3 transition-colors duration-[60ms] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
