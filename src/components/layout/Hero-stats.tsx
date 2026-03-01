'use client';

import React, { useEffect, useState, useRef } from 'react';

const COUNT_UP_DURATION_MS = 1400;
const SLIDE_IN_DURATION_MS = 500;
const COUNT_UP_EASING = (t: number) => 1 - (1 - t) * (1 - t);

export const Hero_stat: React.FC = () => {
  const [timeAlive, setTimeAlive] = useState(0);
  const [displayMinutes, setDisplayMinutes] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const birthDate = new Date('2006-01-17').getTime();
    const calc = () => {
      const minutes = Math.floor((Date.now() - birthDate) / (1000 * 60));
      setTimeAlive(minutes);
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || timeAlive <= 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && setHasStarted((prev) => prev || true),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [timeAlive]);

  useEffect(() => {
    if (!hasStarted || timeAlive <= 0) return;
    if (prefersReducedMotion) {
      setDisplayMinutes(timeAlive);
      return;
    }
    const start = performance.now();
    const run = (now: number) => {
      const progress = Math.min((now - start) / COUNT_UP_DURATION_MS, 1);
      setDisplayMinutes(Math.floor(COUNT_UP_EASING(progress) * timeAlive));
      if (progress < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [hasStarted, timeAlive, prefersReducedMotion]);

  useEffect(() => {
    if (hasStarted && prefersReducedMotion) setDisplayMinutes(timeAlive);
  }, [timeAlive, hasStarted, prefersReducedMotion]);

  const countUpDoneRef = useRef(false);
  useEffect(() => {
    if (!hasStarted || prefersReducedMotion) return;
    const t = setTimeout(() => { countUpDoneRef.current = true; }, COUNT_UP_DURATION_MS + 100);
    return () => clearTimeout(t);
  }, [hasStarted, prefersReducedMotion]);
  useEffect(() => {
    if (countUpDoneRef.current) setDisplayMinutes(timeAlive);
  }, [timeAlive]);

  const slideDuration = prefersReducedMotion ? 0 : SLIDE_IN_DURATION_MS;
  const div1Transform = hasStarted || prefersReducedMotion ? 'translateX(0)' : 'translateX(100%)';

  return (
    <div ref={sectionRef} className="rounded-lg border-none bg-surface-dark-1 text-text-inverted-1">
      <div className="mx-auto px-3 py-3">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="px-2 py-1 rounded-sm bg-primary-darker text-sm font-mono text-text-primary">
            Based in Washington D.C. Area
          </div>

          {/* Time alive: 3 divs — (1) dot + "alive for", (2) number, (3) "min" */}
          <div className="flex items-center gap-2 mr-2">
            {/* Div 1: dot + "alive for" — slides left from the right on load */}
            <div
              className="flex items-center gap-2 shrink-0 transition-transform ease-out"
              style={{
                transform: div1Transform,
                transitionDuration: `${slideDuration}ms`,
              }}
            >
              <svg
                className="shrink-0"
                width={24}
                height={24}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                {/* Back: primary-darker circle — pulses (shrink/grow) behind; group for transform-origin at center */}
                <g
                  style={{
                    transformOrigin: '10px 10px',
                    animation: prefersReducedMotion ? 'none' : 'hero-stat-dot-pulse 1s ease-in-out infinite',
                  }}
                >
                  <circle
                    cx={10}
                    cy={10}
                    r={6}
                    style={{ fill: 'var(--color-primary-darker)' }}
                  />
                </g>
                {/* Front: primary-base circle */}
                <circle
                  cx={10}
                  cy={10}
                  r={4}
                  style={{ fill: 'var(--color-primary-base)' }}
                />
              </svg>
              <span className="text-sm font-mono">alive for</span>
            </div>

            {/* Div 2: number only — count-up from 0 on load; width grows with digits, gap to div1 stays fixed */}
            <div className="text-sm font-mono tabular-nums w-[85]">
              {displayMinutes.toLocaleString()}
            </div>

            {/* Div 3: "min" — static, no transform */}
            <div className="text-sm font-mono shrink-0">min</div>
          </div>
        </div>
      </div>
    </div>
  );
};
