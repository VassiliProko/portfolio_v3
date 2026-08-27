'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

const RIVE_SRC = '/images/optimized/jetpacks/rive/jetpacks-loading-flying.riv';
const WORDMARK_SRC = '/images/optimized/jetpacks/jetpacks-wordmark.svg';

/** Combined dark-mode lockup is 770×240; logomark sits at (53, 32) as 155×161. */
const LOCKUP_WIDTH = 770;
const LOCKUP_HEIGHT = 240;
const LOGOMARK_LEFT = 53;
const LOGOMARK_TOP = 32;
const LOGOMARK_WIDTH = 155;
const LOGOMARK_HEIGHT = 161;
const WORDMARK_LEFT = 245;
const WORDMARK_TOP = 76.434;
const WORDMARK_WIDTH = 459;
const WORDMARK_HEIGHT = 108;

const LOGOMARK_SCALE = 2.5;
/** Preserves the prior translate-y-[18%] nudge after dropping CSS scale. */
const LOGOMARK_DOWN_SHIFT = 0.18;
const LOGOMARK_NUDGE_X = -4;
const LOGOMARK_NUDGE_Y = -4;

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function getScaledLogomarkPlacement() {
  const scaledWidth = LOGOMARK_WIDTH * LOGOMARK_SCALE;
  const scaledHeight = LOGOMARK_HEIGHT * LOGOMARK_SCALE;
  const left = LOGOMARK_LEFT - (LOGOMARK_WIDTH * (LOGOMARK_SCALE - 1)) / 2;
  const top =
    LOGOMARK_TOP -
    (LOGOMARK_HEIGHT * (LOGOMARK_SCALE - 1)) / 2 +
    LOGOMARK_HEIGHT * LOGOMARK_DOWN_SHIFT;

  return {
    left: `calc(${percent(left, LOCKUP_WIDTH)} + ${LOGOMARK_NUDGE_X}px)`,
    top: `calc(${percent(top, LOCKUP_HEIGHT)} + ${LOGOMARK_NUDGE_Y}px)`,
    width: percent(scaledWidth, LOCKUP_WIDTH),
    height: percent(scaledHeight, LOCKUP_HEIGHT),
  };
}

function JetpacksFlyingMark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { RiveComponent, rive } = useRive(
    {
      src: RIVE_SRC,
      autoplay: false,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    },
    { shouldResizeCanvasToContainer: true },
  );

  useEffect(() => {
    if (!rive) return;

    const syncCanvasResolution = () => {
      rive.resizeDrawingSurfaceToCanvas();
    };

    syncCanvasResolution();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      syncCanvasResolution();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [rive]);

  useEffect(() => {
    if (!rive) return;

    if (prefersReducedMotion) {
      rive.pause();
      return;
    }

    const stateMachine = rive.stateMachineNames[0];
    if (stateMachine) {
      rive.play(stateMachine);
      return;
    }

    const animation = rive.animationNames[0];
    if (animation) {
      rive.play(animation);
    }
  }, [rive, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <RiveComponent className="pointer-events-none block h-full w-full [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />
    </div>
  );
}

export function JetpacksShowcaseLockup() {
  const logomarkPlacement = getScaledLogomarkPlacement();

  return (
    <div className="flex h-full w-full items-center justify-center px-md py-sm" aria-hidden>
      <div
        className="relative w-[88%] max-w-[360px]"
        style={{ aspectRatio: `${LOCKUP_WIDTH} / ${LOCKUP_HEIGHT}` }}
      >
        <div
          className="absolute overflow-visible"
          style={logomarkPlacement}
        >
          <JetpacksFlyingMark />
        </div>
        <Image
          src={WORDMARK_SRC}
          alt=""
          width={WORDMARK_WIDTH}
          height={WORDMARK_HEIGHT}
          className="pointer-events-none absolute select-none object-contain"
          style={{
            left: percent(WORDMARK_LEFT, LOCKUP_WIDTH),
            top: percent(WORDMARK_TOP, LOCKUP_HEIGHT),
            width: percent(WORDMARK_WIDTH, LOCKUP_WIDTH),
            height: percent(WORDMARK_HEIGHT, LOCKUP_HEIGHT),
          }}
          sizes="(max-width: 768px) 50vw, 220px"
        />
      </div>
    </div>
  );
}
