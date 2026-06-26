'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import {
  HOME_INTRO_HIGHLIGHT_REEL_ENTER_BLUR_PX,
  HOME_INTRO_HIGHLIGHT_REEL_ENTER_DURATION_S,
  HOME_INTRO_HIGHLIGHT_REEL_ENTER_EASE,
  HOME_INTRO_HIGHLIGHT_REEL_ENTER_OFFSET_PX,
  HOME_INTRO_HIGHLIGHT_REEL_ENTER_SCALE_X,
} from '@/src/components/ui/homeIntroMotion';

type HighlightReelSectionProps = {
  visible?: boolean;
};

export const HighlightReelSection: React.FC<HighlightReelSectionProps> = ({
  visible = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  }, []);

  return (
    <section className="my-8 w-full" aria-label="Highlight reel">
      <motion.div
        className="relative w-full origin-bottom overflow-hidden rounded-lg"
        initial={{
          opacity: 0,
          y: HOME_INTRO_HIGHLIGHT_REEL_ENTER_OFFSET_PX,
          scaleX: HOME_INTRO_HIGHLIGHT_REEL_ENTER_SCALE_X,
          filter: `blur(${HOME_INTRO_HIGHLIGHT_REEL_ENTER_BLUR_PX}px)`,
        }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible || prefersReducedMotion ? 0 : HOME_INTRO_HIGHLIGHT_REEL_ENTER_OFFSET_PX,
          scaleX: visible || prefersReducedMotion ? 1 : HOME_INTRO_HIGHLIGHT_REEL_ENTER_SCALE_X,
          filter:
            visible || prefersReducedMotion
              ? 'blur(0px)'
              : `blur(${HOME_INTRO_HIGHLIGHT_REEL_ENTER_BLUR_PX}px)`,
        }}
        style={{ willChange: 'transform, opacity, filter' }}
        transition={{
          duration: prefersReducedMotion ? 0 : HOME_INTRO_HIGHLIGHT_REEL_ENTER_DURATION_S,
          ease: HOME_INTRO_HIGHLIGHT_REEL_ENTER_EASE,
        }}
      >
        <Image
          src="/images/optimized/home/BG_blue-sky.png"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, calc(100vw - 64px)"
          aria-hidden
        />

        <div className="relative z-[1] flex items-center justify-center px-24 py-16">
          <div className="group relative aspect-video w-full overflow-hidden rounded-md bg-background shadow-highlight-reel-video-outer">
            <video
              ref={videoRef}
              src="/other/dojo-icons-animated.mov"
              autoPlay={!prefersReducedMotion}
              muted
              loop
              playsInline
              onPlay={() => setIsPaused(false)}
              onPause={() => setIsPaused(true)}
              onLoadedData={(event) => setIsPaused(event.currentTarget.paused)}
              className="h-full w-full object-contain"
            />

            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPaused ? 'Play highlight reel video' : 'Pause highlight reel video'}
              className={cn(
                'absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm bg-surface-dark-1 text-text-inverted-1',
                'opacity-0 transition-all duration-[60ms] ease-snap hover:bg-surface-dark-2',
                'group-hover:opacity-100 group-focus-within:opacity-100',
                isPaused && 'opacity-100',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
              )}
            >
              {isPaused ? (
                <Play size={20} strokeWidth={2} aria-hidden />
              ) : (
                <Pause size={20} strokeWidth={2} aria-hidden />
              )}
            </button>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[11] rounded-lg shadow-highlight-reel-inset"
          aria-hidden
        />
      </motion.div>
    </section>
  );
};
