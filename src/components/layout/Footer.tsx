'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { cn } from '@/src/utils/cn';

const linkClass =
  'hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-sm';

type ConsoleLineConfig =
  | { id: number; type: 'text'; text: string }
  | { id: number; type: 'link'; linkText: string; href: string; suffix?: string };

const CONSOLE_LINES: ConsoleLineConfig[] = [
  { id: 1, type: 'text', text: 'footer.log("you have the capacity to create beauty in this world")' },
  { id: 2, type: 'text', text: 'display.pages()' },
  { id: 3, type: 'link', linkText: 'home', href: '/' },
  { id: 4, type: 'link', linkText: 'work', href: '/work', suffix: ' [mcss, prettify minerva]' },
  { id: 5, type: 'link', linkText: 'art', href: '/play' },
  { id: 6, type: 'link', linkText: 'about', href: '/about' },
];

function getLineLength(line: ConsoleLineConfig): number {
  if (line.type === 'text') return line.text.length;
  return line.linkText.length + (line.suffix?.length ?? 0);
}

function renderConsoleLine(line: ConsoleLineConfig, visibleChars: number): React.ReactNode {
  const len = getLineLength(line);
  const n = Math.min(visibleChars, len);
  if (n <= 0) return null;

  if (line.type === 'text') {
    return <>{line.text.slice(0, n)}</>;
  }

  const linkShow = Math.min(n, line.linkText.length);
  const suffixShow = line.suffix && n > line.linkText.length ? line.suffix.slice(0, n - line.linkText.length) : '';

  return (
    <>
      {linkShow > 0 && (
        <Link href={line.href} className={linkClass}>
          {line.linkText.slice(0, linkShow)}
        </Link>
      )}
      {suffixShow}
    </>
  );
}

const LINE_START_DELAY_MS = 100;
const CHAR_DELAY_MS = 35;

export const Footer: React.FC = () => {
  const consoleRef = useRef<HTMLDivElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [visibleCounts, setVisibleCounts] = useState<number[]>(() => CONSOLE_LINES.map(() => 0));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = consoleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) setHasRevealed(true);
      },
      { threshold: 0.2, rootMargin: '0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // When in view, run typewriter: each line starts after LINE_START_DELAY, then types one char every CHAR_DELAY
  useEffect(() => {
    if (!hasRevealed) return;
    const lineLengths = CONSOLE_LINES.map(getLineLength);
    const lineDelay = prefersReducedMotion ? 0 : LINE_START_DELAY_MS;
    const charDelay = prefersReducedMotion ? 0 : CHAR_DELAY_MS;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    CONSOLE_LINES.forEach((_, lineIndex) => {
      const startAt = lineIndex * lineDelay;
      timeouts.push(
        setTimeout(() => {
          const totalChars = lineLengths[lineIndex];
          if (charDelay <= 0) {
            setVisibleCounts((prev) => {
              const next = [...prev];
              next[lineIndex] = totalChars;
              return next;
            });
            return;
          }
          let charIndex = 0;
          const interval = setInterval(() => {
            charIndex += 1;
            setVisibleCounts((prev) => {
              const next = [...prev];
              next[lineIndex] = Math.min(charIndex, totalChars);
              return next;
            });
            if (charIndex >= totalChars) clearInterval(interval);
          }, charDelay);
          intervals.push(interval);
        }, startAt)
      );
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [hasRevealed, prefersReducedMotion]);

  return (
    <footer className="w-full bg-background">
      <div className="max-w-[1200px] mx-auto px-5 py-8 md:py-10">
        {/* Upper section: console-style card with background image — color on hover over this element only */}
        <div className="group relative overflow-hidden rounded-tl-md rounded-tr-md min-h-[280px] md:min-h-[320px] bg-surface-dark-1">
          {/* Background image: grayscale by default, color on hover over this card */}
          <div className="absolute inset-0">
            <Image
              src="/images/optimized/ui/footer-image.webp"
              alt=""
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-1000 ease-[cubic-bezier(0,.9,.1,1)]"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority={false}
            />
            {/* Dark overlay for console text readability */}
            <div className="absolute inset-0 bg-surface-dark-1/70" aria-hidden />
            {/* Black radial gradient from top-left, fading to transparent */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 200% 150% at 0% 0%, var(--color-surface-dark-1) 0%, transparent 70%)',
              }}
              aria-hidden
            />
          </div>

          {/* Console text content — scroll-triggered line-by-line reveal */}
          <div
            ref={consoleRef}
            className="relative z-10 flex flex-col justify-between h-full min-h-[280px] md:min-h-[320px] p-5 md:p-6"
          >
            <pre className="font-mono text-sm md:text-base text-text-inverted-1 leading-relaxed flex flex-col gap-0">
              {CONSOLE_LINES.map((line, index) => (
                <span key={line.id} className="inline-block">
                  <span className="text-primary-base">&gt;</span>{' '}
                  {renderConsoleLine(line, visibleCounts[index] ?? 0)}
                </span>
              ))}
            </pre>

            {/* Color stripe */}
            
          </div>
        </div>
        <div className="flex w-full h-2 rounded-bl-md rounded-br-md overflow-hidden shrink-0">
              <div className="flex-[1] bg-surface-dark-1" />
              <div className="flex-[2] bg-primary-base" />
              <div className="flex-[2] bg-primary-darker" />
              <div className="flex-[2] bg-accent-base" />
              <div className="flex-[1] bg-text-inverted-1" />
            </div>
        {/* Lower section: contact buttons + branding */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mt-3">
          {/* Black container wrapping both buttons (Figma 249-348) */}
          <div className="inline-flex rounded-lg overflow-hidden bg-surface-dark-1 px-2 py-2 gap-2">
            <a
              href="https://www.linkedin.com/in/vassili-prokopenko"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'font-mono text-sm inline-flex items-center justify-center py-1 px-2 rounded-md',
                'bg-surface-dark-2 text-text-inverted-1',
                'hover:bg-white/10 transition-colors duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
              )}
            >
              LinkedIn
            </a>
            <a
              href="mailto:vassiligb12@gmail.com"
              className={cn(
                'font-mono text-sm inline-flex items-center justify-center py-1 px-2 rounded-md',
                'bg-surface-dark-2 text-text-inverted-1',
                'hover:bg-white/10 transition-colors duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
              )}
            >
              Email Me
            </a>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-1 border border-border-base">
            <Heart className="w-5 h-5 text-primary-base shrink-0" strokeWidth={2} aria-hidden />
            <span className="text-text-muted text-sm font-sans">Designed with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
