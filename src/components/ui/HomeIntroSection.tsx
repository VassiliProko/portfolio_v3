'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/src/utils/cn';
import BlurText from '@/src/components/ui/BlurText';

type HighlightedWordProps = {
  children: React.ReactNode;
  tone: 'munching' | 'cooking';
  className?: string;
};

const HighlightedWord: React.FC<HighlightedWordProps> = ({ children, tone, className }) => {
  const textClass = tone === 'munching' ? 'text-intro-munching' : 'text-intro-cooking';
  const bgClass =
    tone === 'munching' ? 'bg-intro-munching-highlight' : 'bg-intro-cooking-highlight';

  return (
    <span className={cn('relative inline-block px-1', className)}>
      <span
        className={cn(
          'pointer-events-none absolute inset-x-0 top-1/2 h-[46px] -translate-y-1/2 rounded-lg',
          bgClass
        )}
        aria-hidden
      />
      <span className={cn('relative z-[1]', textClass)}>{children}</span>
    </span>
  );
};

const HEADLINE_SEGMENTS = [
  { key: 'hi', content: 'hi, im a' },
  { key: 'young', content: <span className="italic">young</span> },
  { key: 'lad', content: 'lad busy' },
  { key: 'munching', content: <HighlightedWord tone="munching">munching</HighlightedWord> },
  { key: 'and', content: '&' },
  { key: 'cooking', content: <HighlightedWord tone="cooking">cooking</HighlightedWord> },
  { key: 'delightful', content: 'delightful' },
  {
    key: 'creations',
    content: <span className="font-display text-[36px] leading-normal">creations</span>,
  },
] as const;

const WAVE_DELAY_MS = 55;
const WAVE_DURATION_S = 0.65;

/** Gentle subtitle reveal — opacity + drop from above, design-system enter easing */
const SUBTITLE_FADE_DURATION_S = 2.4;
const SUBTITLE_FADE_OFFSET_PX = 28;
const SUBTITLE_ENTER_EASE = [0, 0.9, 0.1, 1] as const;

export const HomeIntroSection: React.FC = () => {
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="relative flex w-full flex-col items-start gap-3 py-6"
      aria-label="Introduction"
    >
      <BlurText
        wave
        segments={[...HEADLINE_SEGMENTS]}
        delay={WAVE_DELAY_MS}
        direction="top"
        stepDuration={WAVE_DURATION_S}
        className="relative max-w-full text-left font-sans text-[32px] font-medium leading-normal text-text"
        onAnimationComplete={() => setSubtitleVisible(true)}
      />

      <motion.p
        className="max-w-full text-left font-sans text-xl font-medium lowercase leading-normal text-intro-subtitle"
        initial={false}
        animate={{
          opacity: subtitleVisible ? 1 : 0,
          y: subtitleVisible || prefersReducedMotion ? 0 : -SUBTITLE_FADE_OFFSET_PX,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : SUBTITLE_FADE_DURATION_S,
          delay: 0,
          ease: SUBTITLE_ENTER_EASE,
        }}
      >
        currently product @ revisiondojo (yc24)
      </motion.p>
    </div>
  );
};
