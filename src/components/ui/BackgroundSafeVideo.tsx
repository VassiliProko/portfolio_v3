'use client';

import { useRef, type VideoHTMLAttributes } from 'react';
import { useBackgroundSafeVideo } from '@/src/hooks/useBackgroundSafeVideo';
import { cn } from '@/src/utils/cn';

type BackgroundSafeVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'autoPlay' | 'muted' | 'playsInline'
> & {
  sources?: Array<{
    src: string;
    type: string;
  }>;
  /** When false, stays paused. Default true. */
  enabled?: boolean;
};

/**
 * Drop-in muted looping video that pauses off-screen / in background tabs
 * and resumes without Chrome power-saving play() console errors.
 */
export const BackgroundSafeVideo: React.FC<BackgroundSafeVideoProps> = ({
  sources,
  enabled = true,
  className,
  loop = true,
  preload = 'metadata',
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useBackgroundSafeVideo(videoRef, { enabled, shouldPlay: enabled });

  return (
    <video
      ref={videoRef}
      className={cn(className)}
      muted
      playsInline
      loop={loop}
      preload={preload}
      // Playback is owned by useBackgroundSafeVideo — avoid native autoplay races.
      autoPlay={false}
      {...props}
    >
      {sources?.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
};
