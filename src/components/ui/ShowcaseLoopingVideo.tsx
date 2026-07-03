'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_LOOP_DELAY_MS = 1000;

type ShowcaseLoopingVideoProps = {
  src?: string;
  sources?: Array<{
    src: string;
    type: string;
  }>;
  className?: string;
  ariaLabel: string;
  loopDelayMs?: number;
};

export const ShowcaseLoopingVideo: React.FC<ShowcaseLoopingVideoProps> = ({
  src,
  sources,
  className,
  ariaLabel,
  loopDelayMs = DEFAULT_LOOP_DELAY_MS,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    let loopTimeoutId: number | undefined;

    const restartAfterDelay = () => {
      loopTimeoutId = window.setTimeout(() => {
        video.currentTime = 0;
        void video.play();
      }, loopDelayMs);
    };

    video.loop = false;
    video.addEventListener('ended', restartAfterDelay);

    return () => {
      video.removeEventListener('ended', restartAfterDelay);
      window.clearTimeout(loopTimeoutId);
    };
  }, [loopDelayMs, src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      playsInline
      autoPlay
      preload="auto"
      aria-label={ariaLabel}
    >
      {sources?.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
};
