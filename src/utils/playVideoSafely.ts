/**
 * Calls HTMLMediaElement.play() and swallows AbortError / NotAllowedError.
 * Chrome rejects play() when it pauses muted video-only media to save power
 * (background tabs); catching prevents noisy console errors.
 */
export function playVideoSafely(video: HTMLMediaElement): Promise<boolean> {
  try {
    const playPromise = video.play();
    if (playPromise === undefined) {
      return Promise.resolve(!video.paused);
    }

    return playPromise.then(() => true).catch(() => false);
  } catch {
    return Promise.resolve(false);
  }
}
