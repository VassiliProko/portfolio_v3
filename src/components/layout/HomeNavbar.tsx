'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

function scrollToAbout(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('about');
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

export const HomeNavbar: React.FC = () => {
  return (
    <>
      <Link
        href="/"
        className="flex items-center gap-3 py-3 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
        aria-label="Home"
      >
        <span className="relative block h-9 w-9 shrink-0">
          <Image
            src="/logo.svg"
            alt=""
            fill
            className="object-contain"
            priority
            aria-hidden
          />
        </span>
        <span className="font-sans text-base font-bold uppercase tracking-[0.15em] text-name-gradient">
          Vassili Prokopenko
        </span>
      </Link>

      <Link
        href="/#about"
        onClick={scrollToAbout}
        className="flex items-center gap-[6px] py-3 font-mono text-base uppercase text-text transition-all duration-[60ms] ease-snap hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
      >
        About
        <ArrowRight size={24} strokeWidth={2} aria-hidden />
      </Link>
    </>
  );
};
