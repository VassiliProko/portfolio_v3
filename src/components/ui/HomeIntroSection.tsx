'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BlurText from '@/src/components/ui/BlurText';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';

import {
  HOME_INTRO_SECONDARY_ENTER_DURATION_S,
  HOME_INTRO_SECONDARY_ENTER_EARLY_MS,
  HOME_INTRO_SECONDARY_ENTER_EASE,
  HOME_INTRO_SUBTITLE_ENTER_OFFSET_PX,
} from '@/src/components/ui/homeIntroMotion';

const HEADLINE =
  'hi, im a young lad busy munching & cooking delightful creations';

const WAVE_DELAY_MS = 55;
const WAVE_DURATION_S = 0.65;

const INTRO_TEXT_CLASS =
  'relative max-w-full text-left font-sans text-[32px] font-medium leading-normal text-text';

type HomeIntroSectionProps = {
  onHeadlineComplete?: () => void;
};

export const HomeIntroSection: React.FC<HomeIntroSectionProps> = ({ onHeadlineComplete }) => {
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { introBlurReady } = useHomeEnterAnimation();

  return (
    <div
      className="relative flex w-full flex-col items-start gap-3 py-6"
      aria-label="Introduction"
    >
      <BlurText
        wave
        text={HEADLINE}
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

      <motion.p
        className="max-w-full text-left font-sans text-xl font-medium leading-normal text-text-muted"
        initial={false}
        animate={{
          opacity: subtitleVisible ? 1 : 0,
          y: subtitleVisible || prefersReducedMotion ? 0 : -HOME_INTRO_SUBTITLE_ENTER_OFFSET_PX,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : HOME_INTRO_SECONDARY_ENTER_DURATION_S,
          delay: 0,
          ease: HOME_INTRO_SECONDARY_ENTER_EASE,
        }}
      >
        currently designing at RevisionDojo
      </motion.p>
    </div>
  );
};
