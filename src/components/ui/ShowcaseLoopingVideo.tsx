'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useBackgroundSafeVideo } from '@/src/hooks/useBackgroundSafeVideo';
import { playVideoSafely } from '@/src/utils/playVideoSafely';
import { useHoverSurface } from '@/src/components/ui/HoverMetaPill';

type ShowcaseLoopingVideoProps = {
  src?: string;
  sources?: Array<{
    src: string;
    type: string;
  }>;
  className?: string;
  ariaLabel: string;
  poster?: string;
  preload?: 'none' | 'metadata' | 'auto';
  /** Pause before replay; 0 uses native seamless loop. */
  loopDelayMs?: number;
  /** When false, keep the video paused (e.g. while a lightbox is open). */
  shouldPlay?: boolean;
  /** Only play while the containing hover surface is under the pointer. */
  playOnHover?: boolean;
};

export const ShowcaseLoopingVideo: React.FC<ShowcaseLoopingVideoProps> = ({
  src,
  sources,
  className,
  ariaLabel,
  poster,
  preload = 'metadata',
  loopDelayMs = 0,
  shouldPlay = true,
  playOnHover = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isPointerWithin } = useHoverSurface();
  const useDelayedLoop = loopDelayMs > 0;
  const canPlay =
    shouldPlay && !prefersReducedMotion && (!playOnHover || isPointerWithin);

  useBackgroundSafeVideo(videoRef, { enabled: true, shouldPlay: canPlay });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playOnHover || canPlay) {
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [canPlay, playOnHover]);

  useEffect(() => {
    if (!useDelayedLoop || !canPlay) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    let loopTimeoutId: number | undefined;

    const restartAfterDelay = () => {
      loopTimeoutId = window.setTimeout(() => {
        if (document.hidden) {
          return;
        }
        video.currentTime = 0;
        void playVideoSafely(video);
      }, loopDelayMs);
    };

    video.loop = false;
    video.addEventListener('ended', restartAfterDelay);

    return () => {
      video.removeEventListener('ended', restartAfterDelay);
      window.clearTimeout(loopTimeoutId);
    };
  }, [canPlay, loopDelayMs, src, useDelayedLoop]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      playsInline
      autoPlay={false}
      loop={!useDelayedLoop}
      preload={preload}
      poster={poster}
      aria-label={ariaLabel}
    >
      {sources?.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
};
