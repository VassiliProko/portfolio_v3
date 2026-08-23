'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { cn } from '@/src/utils/cn';

const RIVE_SRC = '/images/optimized/jetpacks/rive/jetpacks-waving.riv';

type JetpacksWavingAnimationProps = {
  /** Subtitle paragraph under the animation. */
  caption?: React.ReactNode;
};

export function JetpacksWavingAnimation({ caption }: JetpacksWavingAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const { RiveComponent, rive } = useRive({
    src: RIVE_SRC,
    autoplay: false,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (!rive || prefersReducedMotion) return;

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
    <figure className={cn('m-0 flex w-full flex-col', caption ? 'gap-2xs' : 'gap-0')}>
      <div
        className="flex w-full items-center justify-center overflow-hidden rounded-[8px] bg-surface-1 px-md py-xl dark:bg-jetpacks-media md:py-2xl"
        aria-label="Jetpacks waving animation"
      >
        <div className="relative aspect-square w-full max-w-[185px] sm:max-w-[218px] md:max-w-[252px]">
          <RiveComponent className="h-full w-full" />
        </div>
      </div>
      {caption ? (
        <figcaption className="flex w-full flex-col gap-2xs">
          <div className="type-paragraph m-0 text-text [&_p]:m-0">{caption}</div>
        </figcaption>
      ) : null}
    </figure>
  );
}
