'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/utils/cn';
import { FooterFluidReveal } from '@/src/components/ui/FooterFluidReveal';

type FooterProps = {
  lastUpdated: React.ReactNode;
};

const linkClass =
  'text-footer-console-text hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-sm';

const contactLinkClass = cn(
  'font-mono text-base inline-flex items-center justify-center h-12 px-4',
  'bg-footer-contact-bg text-footer-console-text',
  'hover:bg-footer-contact-bg-hover transition-colors duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
);

type ConsoleLineConfig =
  | { id: number; type: 'text'; text: string }
  | { id: number; type: 'link'; linkText: string; href: string; suffix?: string };

const CONSOLE_LINES: ConsoleLineConfig[] = [
  { id: 1, type: 'text', text: 'footer.log("you have the capacity to create beauty in this world")' },
  { id: 2, type: 'text', text: 'display.pages()' },
  { id: 3, type: 'link', linkText: 'home', href: '/' },
  { id: 4, type: 'link', linkText: 'about', href: '/about' },
];

function getLineLength(line: ConsoleLineConfig): number {
  if (line.type === 'text') return line.text.length;
  return line.linkText.length + (line.suffix?.length ?? 0);
}

const CONSOLE_TEXT_CLASS = 'text-footer-console-text';
const BEAUTY_WORD = 'beauty';

/** Renders a quoted string slice; "beauty" uses the navbar name gradient when visible. */
function renderQuotedString(quotedSlice: string, key: number): React.ReactNode {
  const beautyIndex = quotedSlice.indexOf(BEAUTY_WORD);

  if (beautyIndex === -1) {
    return (
      <span key={key} className={CONSOLE_TEXT_CLASS}>
        {quotedSlice}
      </span>
    );
  }

  const before = quotedSlice.slice(0, beautyIndex);
  const beautyEnd = beautyIndex + BEAUTY_WORD.length;
  const beautyVisible = quotedSlice.slice(beautyIndex, Math.min(beautyEnd, quotedSlice.length));
  const after = quotedSlice.slice(Math.min(beautyEnd, quotedSlice.length));

  return (
    <span key={key} className={CONSOLE_TEXT_CLASS}>
      {before}
      {beautyVisible ? <span className="text-name-gradient-light">{beautyVisible}</span> : null}
      {after}
    </span>
  );
}

/** Typed console text — all white except "beauty" gradient inside the log string. */
function renderTypedConsoleText(text: string, visibleChars: number): React.ReactNode {
  const visible = text.slice(0, Math.min(visibleChars, text.length));
  if (!visible) return null;

  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < visible.length) {
    if (visible[i] === '"') {
      const close = visible.indexOf('"', i + 1);
      const end = close === -1 ? visible.length : close + 1;
      nodes.push(renderQuotedString(visible.slice(i, end), key++));
      i = end;
      continue;
    }

    // Method / property after a dot
    if (visible[i] === '.' && i + 1 < visible.length && /[a-zA-Z_]/.test(visible[i + 1]!)) {
      let end = i + 1;
      while (end < visible.length && /[a-zA-Z0-9_]/.test(visible[end]!)) end += 1;
      nodes.push(
        <span key={key++} className={CONSOLE_TEXT_CLASS}>
          {visible.slice(i, end)}
        </span>
      );
      i = end;
      continue;
    }

    // Plain chunk until next string or method
    let end = i + 1;
    while (end < visible.length) {
      const ch = visible[end]!;
      if (ch === '"') break;
      if (ch === '.' && end + 1 < visible.length && /[a-zA-Z_]/.test(visible[end + 1]!)) break;
      end += 1;
    }
    nodes.push(
      <span key={key++} className={CONSOLE_TEXT_CLASS}>
        {visible.slice(i, end)}
      </span>
    );
    i = end;
  }

  return <>{nodes}</>;
}

type ConsoleLineContext = { pathname: string; prefersReducedMotion: boolean };

function renderConsoleLine(
  line: ConsoleLineConfig,
  visibleChars: number,
  ctx: ConsoleLineContext
): React.ReactNode {
  const len = getLineLength(line);
  const n = Math.min(visibleChars, len);
  if (n <= 0) return null;

  if (line.type === 'text') {
    return renderTypedConsoleText(line.text, n);
  }

  const linkShow = Math.min(n, line.linkText.length);
  const suffixShow = line.suffix && n > line.linkText.length ? line.suffix.slice(0, n - line.linkText.length) : '';

  const isHomeLink = line.href === '/';
  const isOnHome = ctx.pathname === '/';
  const hashMatch = line.href.match(/^\/#(.+)$/);
  const hashId = hashMatch ? hashMatch[1] : null;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: ctx.prefersReducedMotion ? 'auto' : 'smooth' });
  };
  const scrollToHash = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hashId && isOnHome) {
      const target = document.getElementById(hashId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: ctx.prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <>
      {linkShow > 0 && (
        <Link
          href={line.href}
          prefetch={false}
          className={linkClass}
          onClick={
            isHomeLink && isOnHome
              ? (e) => { e.preventDefault(); scrollToTop(); }
              : hashId && isOnHome
                ? scrollToHash
                : undefined
          }
        >
          {line.linkText.slice(0, linkShow)}
        </Link>
      )}
      {suffixShow && <span className={CONSOLE_TEXT_CLASS}>{suffixShow}</span>}
    </>
  );
}

const LINE_START_DELAY_MS = 100;
const CHAR_DELAY_MS = 35;

export const Footer: React.FC<FooterProps> = ({ lastUpdated }) => {
  const pathname = usePathname();
  const consoleRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [visibleCounts, setVisibleCounts] = useState<number[]>(() => CONSOLE_LINES.map(() => 0));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [parallaxProgress, setParallaxProgress] = useState(0);

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

  useEffect(() => {
    if (prefersReducedMotion) return;

    const updateParallax = () => {
      const card = imageCardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalTravelDistance = viewportHeight + rect.height;
      const traveledDistance = viewportHeight - rect.top;
      const nextProgress = Math.min(Math.max(traveledDistance / totalTravelDistance, 0), 1);
      setParallaxProgress(nextProgress);
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax);
    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, [prefersReducedMotion]);

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
    <footer className="w-full py-8 md:py-10">
        {/* Clip wrapper: border-radius alone won't clip WebGL/transformed layers */}
        <div
          className="overflow-hidden rounded-sm"
          style={{ clipPath: 'inset(0 round 4px)' }}
        >
          {/* Upper section: console-style card — fluid trail reveals photo color */}
          <div
            ref={imageCardRef}
            className="relative overflow-hidden min-h-[432px] md:min-h-[528px] bg-surface-dark-1"
          >
            <div
              className="absolute inset-x-0 -inset-y-[24%]"
              style={{
                transform: prefersReducedMotion
                  ? 'translateY(0%)'
                  : `translateY(${(-18 + parallaxProgress * 36).toFixed(3)}%)`,
              }}
            >
              <FooterFluidReveal
                src="/images/optimized/home/footer-image.webp"
                reducedMotion={prefersReducedMotion}
                interactionRef={imageCardRef}
                DENSITY_DISSIPATION={0.75}
                VELOCITY_DISSIPATION={1.2}
                CURL={5}
                SPLAT_RADIUS={0.75}
                SPLAT_FORCE={9000}
              />
              {/* Dark overlay for console text readability — kept lighter so color reveal reads */}
              <div className="absolute inset-0 bg-surface-dark-1/55 pointer-events-none" aria-hidden />
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
              className="relative z-10 flex flex-col justify-between h-full min-h-[432px] md:min-h-[528px] p-5 md:p-6"
            >
              <pre
                className="type-paragraph-mono text-footer-console-text leading-relaxed grid w-fit max-w-full min-w-0 whitespace-pre-wrap break-words rounded-sm px-[8px] py-[5px] backdrop-blur-sm"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-surface-dark-1) 28%, transparent)',
                }}
              >
                {/* Invisible sizer keeps one stable blur panel while typewriter runs */}
                <div className="invisible col-start-1 row-start-1 flex flex-col gap-[5px]" aria-hidden>
                  {CONSOLE_LINES.map((line) => (
                    <span key={line.id} className="block">
                      &gt;{' '}
                      {line.type === 'text'
                        ? line.text
                        : `${line.linkText}${line.suffix ?? ''}`}
                    </span>
                  ))}
                </div>
                <div className="col-start-1 row-start-1 flex flex-col gap-[5px]">
                  {CONSOLE_LINES.map((line, index) => (
                    <span key={line.id} className="block">
                      <span className="text-primary-base">&gt;</span>{' '}
                      {renderConsoleLine(line, visibleCounts[index] ?? 0, { pathname, prefersReducedMotion })}
                    </span>
                  ))}
                </div>
              </pre>
            </div>
          </div>
          {/* Color stripe */}
          <div className="relative z-10 flex h-2 w-full shrink-0">
            <div className="flex-[3] bg-surface-dark-1" />
            <div className="flex-[2] bg-surface-dark-2" />
            <div className="flex-[2] bg-primary-base" />
            <div className="flex-[1.5] bg-primary-darker" />
            <div className="flex-[0.75] bg-accent-base" />
            <div className="flex-[1] bg-footer-console-text" />
          </div>
        </div>
        {/* Lower section: contact buttons + last updated (Figma 212-1039) */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mt-4 h-auto sm:h-12">
          <div className="flex items-start h-12">
            <a
              href="https://www.linkedin.com/in/vassili-prokopenko"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(contactLinkClass, 'relative z-10 rounded-sm -mr-px')}
            >
              LinkedIn
            </a>
            <a
              href="mailto:vassiligb12@gmail.com"
              className={cn(contactLinkClass, 'relative z-0 rounded-[48px]')}
            >
              Email Me
            </a>
          </div>
          {lastUpdated}
        </div>
    </footer>
  );
};
