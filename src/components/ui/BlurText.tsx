'use client';

import { motion, type Transition } from 'motion/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type AnimationSnapshot = Record<string, string | number>;

const buildKeyframes = (from: AnimationSnapshot, steps: AnimationSnapshot[]) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);

  const keyframes: Record<string, (string | number)[]> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

export type BlurTextSegment = {
  key: string;
  content: React.ReactNode;
  className?: string;
};

const WAVE_EASE = [0.22, 1, 0.36, 1] as const;

export type BlurTextProps = {
  text?: string;
  segments?: BlurTextSegment[];
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimationSnapshot;
  animationTo?: AnimationSnapshot[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  /** Fire onAnimationComplete this many ms before the wave naturally ends */
  completeEarlyByMs?: number;
  stepDuration?: number;
  /** Smooth single-step drop with staggered left-to-right wave motion */
  wave?: boolean;
  /** When set, animation is driven by this flag instead of intersection observer */
  trigger?: boolean;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  segments,
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  completeEarlyByMs,
  stepDuration = 0.35,
  wave = false,
  trigger,
}) => {
  const elements = segments ?? (
    animateBy === 'words' ? text.split(' ') : text.split('')
  ).map((segment, index) => ({
    key: `${index}-${segment}`,
    content: segment === ' ' ? '\u00A0' : segment,
  }));

  const [inView, setInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const onCompleteRef = useRef(onAnimationComplete);
  const completeFiredRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (trigger !== undefined || prefersReducedMotion) {
      return;
    }

    if (!ref.current) {
      return;
    }

    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, prefersReducedMotion, trigger]);

  const shouldAnimate = trigger !== undefined ? trigger : inView;

  const fireComplete = () => {
    if (completeFiredRef.current) {
      return;
    }
    completeFiredRef.current = true;
    onCompleteRef.current?.();
  };

  useEffect(() => {
    if (!shouldAnimate) {
      completeFiredRef.current = false;
      return;
    }

    if (prefersReducedMotion) {
      fireComplete();
      return;
    }

    if (completeEarlyByMs != null && completeEarlyByMs > 0) {
      const totalMs = (elements.length - 1) * delay + stepDuration * 1000;
      const fireAt = Math.max(0, totalMs - completeEarlyByMs);
      const id = window.setTimeout(fireComplete, fireAt);
      return () => window.clearTimeout(id);
    }
  }, [
    shouldAnimate,
    prefersReducedMotion,
    completeEarlyByMs,
    elements.length,
    delay,
    stepDuration,
  ]);

  const useEarlyComplete = completeEarlyByMs != null && completeEarlyByMs > 0;

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(5px)', opacity: 0, y: -50 }
        : { filter: 'blur(5px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () =>
      [
        {
          filter: 'blur(2.5px)',
          opacity: 0.5,
          y: direction === 'top' ? 5 : -5,
        },
        { filter: 'blur(0px)', opacity: 1, y: 0 },
      ] as AnimationSnapshot[],
    [direction]
  );

  const waveFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(4px)', opacity: 0, y: -18 }
        : { filter: 'blur(4px)', opacity: 0, y: 18 },
    [direction]
  );

  const waveTo = { filter: 'blur(0px)', opacity: 1, y: 0 };

  const fromSnapshot = animationFrom ?? (wave ? waveFrom : defaultFrom);
  const toSnapshots = animationTo ?? (wave ? [waveTo] : defaultTo);
  const visibleSnapshot = wave ? waveTo : (toSnapshots[toSnapshots.length - 1] ?? waveTo);

  const stepCount = toSnapshots.length + 1;
  const totalDuration = wave ? stepDuration : stepDuration * (stepCount - 1);
  const times = wave
    ? undefined
    : Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  const useSegments = Boolean(segments);

  return (
    <p
      ref={ref}
      className={className}
      style={useSegments ? undefined : { display: 'flex', flexWrap: 'wrap' }}
    >
      {elements.map((segment, index) => {
        const segmentKey = 'key' in segment ? segment.key : `${index}`;
        const segmentContent = 'content' in segment ? segment.content : segment;
        const segmentClassName = 'className' in segment ? segment.className : undefined;
        const animateKeyframes = wave ? waveTo : buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: prefersReducedMotion ? 0 : totalDuration,
          times,
          delay: prefersReducedMotion ? 0 : (index * delay) / 1000,
          ease: wave ? WAVE_EASE : easing,
        };

        const isLast = index === elements.length - 1;
        const showSpace = !useSegments && animateBy === 'words' && index < elements.length - 1;

        return (
          <React.Fragment key={segmentKey}>
            {useSegments && index > 0 ? ' ' : null}
            <motion.span
              className={segmentClassName}
              initial={prefersReducedMotion ? visibleSnapshot : fromSnapshot}
              animate={shouldAnimate ? animateKeyframes : fromSnapshot}
              transition={spanTransition}
              onAnimationComplete={isLast && !useEarlyComplete ? fireComplete : undefined}
              style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
            >
              {segmentContent}
              {showSpace ? '\u00A0' : null}
            </motion.span>
          </React.Fragment>
        );
      })}
    </p>
  );
};

export default BlurText;
