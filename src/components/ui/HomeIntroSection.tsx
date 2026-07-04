'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BlurText from '@/src/components/ui/BlurText';
import { HOME_INTRO_HEADLINE_SEGMENTS } from '@/src/components/ui/HomeIntroHeadlineWords';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';

import {
  HOME_INTRO_SECONDARY_ENTER_DURATION_S,
  HOME_INTRO_SECONDARY_ENTER_EARLY_MS,
  HOME_INTRO_SECONDARY_ENTER_EASE,
  HOME_INTRO_SUBTITLE_ENTER_OFFSET_PX,
  HOME_INTRO_SUBTITLE_LINK_FOCUS_CLASS,
  HOME_INTRO_SUBTITLE_PILL_CLASS,
} from '@/src/components/ui/homeIntroMotion';

const WAVE_DELAY_MS = 55;
const WAVE_DURATION_S = 0.65;

const INTRO_TEXT_CLASS =
  'relative max-w-full cursor-default text-left font-sans text-[32px] font-medium leading-normal text-text';

const REVISION_DOJO_HREF = 'https://revisiondojo.com';

type HomeIntroSectionProps = {
  onHeadlineComplete?: () => void;
  onSubtitleRevealComplete?: () => void;
};

export const HomeIntroSection: React.FC<HomeIntroSectionProps> = ({
  onHeadlineComplete,
  onSubtitleRevealComplete,
}) => {
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { introBlurReady } = useHomeEnterAnimation();
  const subtitleEnterOffset = HOME_INTRO_SUBTITLE_ENTER_OFFSET_PX * 0.6;

  return (
    <div
      className="relative flex w-full flex-col items-start gap-3 py-6"
      aria-label="Introduction"
    >
      <BlurText
        wave
        segments={[...HOME_INTRO_HEADLINE_SEGMENTS]}
        trigger={introBlurReady}
        delay={WAVE_DELAY_MS}
        direction="top"
        stepDuration={WAVE_DURATION_S}
        completeEarlyByMs={HOME_INTRO_SECONDARY_ENTER_EARLY_MS}
        className={INTRO_TEXT_CLASS}
        onAnimationComplete={() => {
          setSubtitleVisible(true);
          onHeadlineComplete?.();
        }}
      />

      <motion.div
        className="relative z-20 flex max-w-full flex-wrap items-center gap-2xs text-left font-sans text-xl font-medium leading-normal text-text-muted"
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
        <motion.a
          href={REVISION_DOJO_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="RevisionDojo. Opens in a new tab."
          className={`${HOME_INTRO_SUBTITLE_PILL_CLASS} ${HOME_INTRO_SUBTITLE_LINK_FOCUS_CLASS}`}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          RevisionDojo (YC F24)
        </motion.a>
      </motion.div>
    </div>
  );
};
