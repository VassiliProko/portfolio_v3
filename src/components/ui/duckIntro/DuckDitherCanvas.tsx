'use client';

import React, { useEffect, useRef } from 'react';
import {
  DUCK_INTRO_CELL_PX,
  DUCK_INTRO_DISPLAY_PX,
  type DuckIntroColorModeId,
  type DuckIntroEffectId,
} from '@/src/components/ui/duckIntro/duckIntroSettings';
import { renderDuckIntroFrame } from '@/src/components/ui/duckIntro/ditherEffects';
import { loadDuckPixels, type DuckPixel } from '@/src/components/ui/duckIntro/duckPixels';

type DuckDitherCanvasProps = {
  effectId: DuckIntroEffectId;
  colorModeId: DuckIntroColorModeId;
  durationS: number;
  /** Increments to restart playback from a full duck */
  playToken: number;
  /** When true, run the dither dissolve */
  dithering: boolean;
  onComplete?: () => void;
  className?: string;
};

function drawPixels(
  ctx: CanvasRenderingContext2D,
  pixels: { x: number; y: number; r: number; g: number; b: number; a: number }[],
) {
  ctx.clearRect(0, 0, DUCK_INTRO_DISPLAY_PX, DUCK_INTRO_DISPLAY_PX);

  for (const pixel of pixels) {
    ctx.fillStyle = `rgba(${pixel.r},${pixel.g},${pixel.b},${pixel.a / 255})`;
    ctx.fillRect(
      pixel.x * DUCK_INTRO_CELL_PX,
      pixel.y * DUCK_INTRO_CELL_PX,
      DUCK_INTRO_CELL_PX,
      DUCK_INTRO_CELL_PX,
    );
  }
}

export const DuckDitherCanvas: React.FC<DuckDitherCanvasProps> = ({
  effectId,
  colorModeId,
  durationS,
  playToken,
  dithering,
  onComplete,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<DuckPixel[] | null>(null);
  const onCompleteRef = useRef(onComplete);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadDuckPixels().then((pixels) => {
      if (cancelled) {
        return;
      }
      pixelsRef.current = pixels;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        return;
      }
      drawPixels(ctx, pixels);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }

    let rafId = 0;
    let completed = false;

    const finish = () => {
      if (completed) {
        return;
      }
      completed = true;
      ctx.clearRect(0, 0, DUCK_INTRO_DISPLAY_PX, DUCK_INTRO_DISPLAY_PX);
      onCompleteRef.current?.();
    };

    const drawIdle = () => {
      const pixels = pixelsRef.current;
      if (!pixels) {
        return;
      }
      drawPixels(ctx, pixels);
    };

    if (!dithering) {
      drawIdle();
      return;
    }

    if (reducedMotionRef.current) {
      finish();
      return;
    }

    const durationMs = Math.max(1, durationS * 1000);
    const seed = playToken * 9973 + 42;
    const start = performance.now();

    const tick = (now: number) => {
      const pixels = pixelsRef.current;
      if (!pixels) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const frame = renderDuckIntroFrame(effectId, {
        pixels,
        progress,
        seed,
        timeMs: elapsed,
        colorModeId,
      });

      drawPixels(ctx, frame);

      if (progress >= 1) {
        finish();
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [colorModeId, durationS, dithering, effectId, playToken]);

  return (
    <canvas
      ref={canvasRef}
      width={DUCK_INTRO_DISPLAY_PX}
      height={DUCK_INTRO_DISPLAY_PX}
      className={className}
      style={{
        width: DUCK_INTRO_DISPLAY_PX,
        height: DUCK_INTRO_DISPLAY_PX,
        imageRendering: 'pixelated',
      }}
      aria-hidden
    />
  );
};
