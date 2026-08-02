'use client';

import { useEffect, useRef } from 'react';
import { useBackgroundSafeVideo } from '@/src/hooks/useBackgroundSafeVideo';
import { playVideoSafely } from '@/src/utils/playVideoSafely';

type ShowcaseLoopingVideoProps = {
  src?: string;
  sources?: Array<{
    src: string;
    type: string;
  }>;
  className?: string;
  ariaLabel: string;
  /** Pause before replay; 0 uses native seamless loop. */
  loopDelayMs?: number;
  /** When false, keep the video paused (e.g. while a lightbox is open). */
  shouldPlay?: boolean;
};

export const ShowcaseLoopingVideo: React.FC<ShowcaseLoopingVideoProps> = ({
  src,
  sources,
  className,
  ariaLabel,
  loopDelayMs = 0,
  shouldPlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const useDelayedLoop = loopDelayMs > 0;

  useBackgroundSafeVideo(videoRef, { enabled: true, shouldPlay });

  useEffect(() => {
    if (!useDelayedLoop) {
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
  }, [loopDelayMs, src, useDelayedLoop]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      playsInline
      autoPlay={false}
      loop={!useDelayedLoop}
      preload="auto"
      aria-label={ariaLabel}
    >
      {sources?.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
};
