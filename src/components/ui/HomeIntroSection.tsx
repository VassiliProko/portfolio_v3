'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { BlurTextSegment } from '@/src/components/ui/BlurText';
import { HOME_INTRO_HEADLINE_SEGMENTS, HOME_INTRO_DESCRIPTION_SEGMENTS } from '@/src/components/ui/HomeIntroHeadlineWords';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';

import { HOME_INTRO_SUBTITLE_LINK_FOCUS_CLASS } from '@/src/components/ui/homeIntroMotion';

const INTRO_TEXT_CLASS =
  'type-paragraph relative max-w-full cursor-default text-left text-text';

const SUBTITLE_CLASS =
  'type-paragraph relative z-20 max-w-full text-left text-text leading-relaxed';

const GENERAL_LEARNING_HREF = 'https://www.generallearning.com/';

type HomeIntroSectionProps = {
  onHeadlineComplete?: () => void;
  onSubtitleRevealComplete?: () => void;
  /** Shared mount reveal for return-visit popdown (synced with showcase) */
  returnReveal?: boolean;
};

const IntroSubtitleLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${children}. Opens in a new tab.`}
    className={`${HOME_INTRO_SUBTITLE_LINK_FOCUS_CLASS} text-text-muted underline-offset-2 hover:underline focus-visible:underline`}
  >
    {children}
  </a>
);

const StaticIntroHeadline: React.FC<{ segments: readonly BlurTextSegment[] }> = ({ segments }) => (
  <p className={INTRO_TEXT_CLASS}>
    {segments.map((segment, index) => {
      const skipLeadingSpace = 'skipLeadingSpace' in segment && segment.skipLeadingSpace;
      const className = 'className' in segment ? segment.className : undefined;

      return (
        <React.Fragment key={segment.key}>
          {index > 0 && !skipLeadingSpace ? ' ' : null}
          <span className={className} style={{ display: 'inline-block' }}>
            {segment.content}
          </span>
        </React.Fragment>
      );
    })}
  </p>
);

const IntroSubtitle: React.FC = () => (
  <>
    {'// Currently studying at '}
    <IntroSubtitleLink href="https://www.mcgill.ca/">
      McGill University
    </IntroSubtitleLink>
    {', previously designing at '}
    <IntroSubtitleLink href={GENERAL_LEARNING_HREF}>
      General Learning (YC F24)
    </IntroSubtitleLink>
  </>
);

export const HomeIntroSection: React.FC<HomeIntroSectionProps> = ({
  onHeadlineComplete,
  onSubtitleRevealComplete,
  returnReveal = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { introBlurReady, isReturnHomeVisit } = useHomeEnterAnimation();
  const reveal = isReturnHomeVisit ? returnReveal : introBlurReady;
  const completedRef = useRef(false);

  return (
    <motion.div
      className="relative flex w-full max-w-[516px] flex-col items-start gap-6 py-6"
      aria-label="Introduction"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
      animate={{ opacity: reveal ? 1 : 0, y: reveal || prefersReducedMotion ? 0 : -8 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={() => {
        if (reveal && !completedRef.current) {
          completedRef.current = true;
          onHeadlineComplete?.();
          onSubtitleRevealComplete?.();
        }
      }}
    >
      <h1 className="sr-only">Vassili Prokopenko — multidisciplinary product, brand, and web designer</h1>
      <div className="flex w-full flex-col gap-3">
        <p className="type-label text-text-subtle">Designer</p>
        <StaticIntroHeadline segments={HOME_INTRO_HEADLINE_SEGMENTS} />
      </div>
      <StaticIntroHeadline segments={HOME_INTRO_DESCRIPTION_SEGMENTS} />
      <div className={SUBTITLE_CLASS}>
        <IntroSubtitle />
      </div>
    </motion.div>
  );
};
