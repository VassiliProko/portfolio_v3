'use client';

import { useEffect, type RefObject } from 'react';
import { playVideoSafely } from '@/src/utils/playVideoSafely';

type UseBackgroundSafeVideoOptions = {
  /** When false, video stays paused (e.g. reduced motion). Default true. */
  enabled?: boolean;
  /**
   * When false, do not auto-resume after tab/viewport becomes active again
   * (e.g. user paused). Default true.
   */
  shouldPlay?: boolean;
};

/**
 * Pauses muted looping videos when the tab is hidden or the element leaves
 * the viewport, and resumes safely when visible again. Avoids Chrome's
 * "video-only background media was paused to save power" play() rejection.
 */
export function useBackgroundSafeVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled = true, shouldPlay = true }: UseBackgroundSafeVideoOptions = {}
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) {
      return;
    }

    let isIntersecting = true;

    const syncPlayback = () => {
      const canPlay = shouldPlay && !document.hidden && isIntersecting;

      if (canPlay) {
        void playVideoSafely(video);
        return;
      }

      if (!video.paused) {
        video.pause();
      }
    };

    const onVisibilityChange = () => {
      syncPlayback();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? false;
        syncPlayback();
      },
      { threshold: 0.01 }
    );

    observer.observe(video);
    document.addEventListener('visibilitychange', onVisibilityChange);
    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (!video.paused) {
        video.pause();
      }
    };
  }, [enabled, shouldPlay, videoRef]);
}
