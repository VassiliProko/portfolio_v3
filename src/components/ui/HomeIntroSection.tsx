'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BlurText from '@/src/components/ui/BlurText';
import { HOME_INTRO_HEADLINE_SEGMENTS } from '@/src/components/ui/HomeIntroHeadlineWords';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';
import { PopdownReveal } from '@/src/components/ui/PopdownReveal';

import {
  HOME_INTRO_SECONDARY_ENTER_DURATION_S,
  HOME_INTRO_SECONDARY_ENTER_EARLY_MS,
  HOME_INTRO_SECONDARY_ENTER_EASE,
  HOME_INTRO_SUBTITLE_ENTER_OFFSET_PX,
  HOME_INTRO_SUBTITLE_LINK_FOCUS_CLASS,
  HOME_INTRO_SUBTITLE_PILL_CLASS,
  HOME_INTRO_WAVE_DELAY_MS,
  HOME_INTRO_WAVE_DURATION_S,
} from '@/src/components/ui/homeIntroMotion';

const INTRO_TEXT_CLASS =
  'relative max-w-full cursor-default text-left font-sans text-[32px] font-medium leading-normal text-text';

const SUBTITLE_CLASS =
  'relative z-20 flex max-w-full flex-wrap items-center gap-2xs text-left font-sans text-xl font-medium leading-normal text-text-muted';

const GENERAL_LEARNING_HREF = 'https://www.generallearning.com/';

type HomeIntroSectionProps = {
  onHeadlineComplete?: () => void;
  onSubtitleRevealComplete?: () => void;
  /** Shared mount reveal for return-visit popdown (synced with showcase) */
  returnReveal?: boolean;
};

const IntroSubtitleLink: React.FC<{ prefersReducedMotion: boolean | null }> = ({
  prefersReducedMotion,
}) => (
  <motion.a
    href={GENERAL_LEARNING_HREF}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="General Learning. Opens in a new tab."
    className={`${HOME_INTRO_SUBTITLE_PILL_CLASS} ${HOME_INTRO_SUBTITLE_LINK_FOCUS_CLASS}`}
    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
  >
    General Learning (YC F24)
  </motion.a>
);

const StaticIntroHeadline: React.FC = () => (
  <p className={INTRO_TEXT_CLASS}>
    {HOME_INTRO_HEADLINE_SEGMENTS.map((segment, index) => {
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

export const HomeIntroSection: React.FC<HomeIntroSectionProps> = ({
  onHeadlineComplete,
  onSubtitleRevealComplete,
  returnReveal = true,
}) => {
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { introBlurReady, isReturnHomeVisit } = useHomeEnterAnimation();
  const subtitleEnterOffset = HOME_INTRO_SUBTITLE_ENTER_OFFSET_PX * 0.6;

  if (isReturnHomeVisit) {
    return (
      <div aria-label="Introduction">
        <PopdownReveal
          reveal={returnReveal}
          className="relative flex w-full flex-col items-start gap-3 py-6"
        >
          <StaticIntroHeadline />
          <div className={SUBTITLE_CLASS}>
            <span>{'// currently designing at'}</span>
            <IntroSubtitleLink prefersReducedMotion={prefersReducedMotion} />
          </div>
        </PopdownReveal>
      </div>
    );
  }

  return (
    <div
      className="relative flex w-full flex-col items-start gap-3 py-6"
      aria-label="Introduction"
    >
      <BlurText
        wave
        segments={[...HOME_INTRO_HEADLINE_SEGMENTS]}
        trigger={introBlurReady}
        delay={HOME_INTRO_WAVE_DELAY_MS}
        direction="top"
        stepDuration={HOME_INTRO_WAVE_DURATION_S}
        completeEarlyByMs={HOME_INTRO_SECONDARY_ENTER_EARLY_MS}
        className={INTRO_TEXT_CLASS}
        onAnimationComplete={() => {
          setSubtitleVisible(true);
          onHeadlineComplete?.();
        }}
      />

      <motion.div
        className={SUBTITLE_CLASS}
        initial={false}
        animate={{
          opacity: subtitleVisible ? 1 : 0,
          y: subtitleVisible || prefersReducedMotion ? 0 : -subtitleEnterOffset,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : HOME_INTRO_SECONDARY_ENTER_DURATION_S,
          delay: 0,
          ease: HOME_INTRO_SECONDARY_ENTER_EASE,
        }}
        onAnimationComplete={() => {
          if (subtitleVisible) {
            onSubtitleRevealComplete?.();
          }
        }}
      >
        <span>{'// currently designing at'}</span>
        <IntroSubtitleLink prefersReducedMotion={prefersReducedMotion} />
      </motion.div>
    </div>
  );
};
