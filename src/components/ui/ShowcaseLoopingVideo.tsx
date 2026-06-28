'use client';

import { useLayoutEffect, useRef } from 'react';

type ShowcaseLoopingVideoProps = {
  src: string;
  className?: string;
  ariaLabel: string;
};

export const ShowcaseLoopingVideo: React.FC<ShowcaseLoopingVideoProps> = ({
  src,
  className,
  ariaLabel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.loop = true;
  }, [src]);

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
    />
  );
};
