'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/src/utils/cn';

/** Matches WorkShowcaseSection card entrance motion */
export const POPDOWN_REVEAL_DURATION_MS = 600;
export const POPDOWN_REVEAL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const POPDOWN_REVEAL_STAGGER_MS = 100;

const DEFAULT_SCROLL_REVEAL_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: '0px 0px -5% 0px',
};

type PopdownRevealProps = {
  children: React.ReactNode;
  reveal?: boolean;
  delayMs?: number;
  className?: string;
  as?: React.ElementType;
};

export function getPopdownRevealProps(
  reveal: boolean,
  delayMs: number,
  prefersReducedMotion: boolean | null,
) {
  const revealClass = reveal
    ? 'opacity-100 translate-y-0 blur-0'
    : 'opacity-0 -translate-y-3 blur-[2px]';

  return {
    className: cn(
      revealClass,
      'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0 motion-reduce:transition-none',
    ),
    style: {
      transitionProperty: 'opacity, transform, filter',
      transitionDuration: prefersReducedMotion ? '0ms' : `${POPDOWN_REVEAL_DURATION_MS}ms`,
      transitionTimingFunction: POPDOWN_REVEAL_EASING,
      transitionDelay: prefersReducedMotion || !reveal ? '0ms' : `${delayMs}ms`,
      willChange: 'transform, opacity, filter',
    } satisfies React.CSSProperties,
  };
}

/** Reveals when the element scrolls into the viewport (showcase-style pop-in). */
export function useScrollPopdownReveal(options: IntersectionObserverInit = DEFAULT_SCROLL_REVEAL_OPTIONS) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(Boolean(prefersReducedMotion));

  useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [prefersReducedMotion, options.root, options.rootMargin, options.threshold]);

  return { ref, revealed };
}

export function useMountPopdownReveal() {
  const prefersReducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(prefersReducedMotion ?? false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealed(true));
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [prefersReducedMotion]);

  return revealed;
}

export const PopdownReveal: React.FC<PopdownRevealProps> = ({
  children,
  reveal = true,
  delayMs = 0,
  className,
  as: Component = 'div',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const revealProps = getPopdownRevealProps(reveal, delayMs, prefersReducedMotion);

  return (
    <Component
      className={cn(revealProps.className, className)}
      style={revealProps.style}
    >
      {children}
    </Component>
  );
};

type ScrollPopdownRevealProps = Omit<PopdownRevealProps, 'reveal'>;

/** Self-contained scroll-triggered showcase pop-in. */
export const ScrollPopdownReveal: React.FC<ScrollPopdownRevealProps> = ({
  children,
  delayMs = 0,
  className,
}) => {
  const { ref, revealed } = useScrollPopdownReveal();
  const prefersReducedMotion = useReducedMotion();
  const revealProps = getPopdownRevealProps(revealed, delayMs, prefersReducedMotion);

  return (
    <div
      ref={ref}
      className={cn(revealProps.className, className)}
      style={revealProps.style}
    >
      {children}
    </div>
  );
};

type ScrollRevealGroupProps = {
  children: (revealed: boolean) => React.ReactNode;
  className?: string;
};

/** Observes scroll once; children stagger via PopdownReveal + delayMs. */
export const ScrollRevealGroup: React.FC<ScrollRevealGroupProps> = ({ children, className }) => {
  const { ref, revealed } = useScrollPopdownReveal();

  return (
    <div ref={ref} className={className}>
      {children(revealed)}
    </div>
  );
};
