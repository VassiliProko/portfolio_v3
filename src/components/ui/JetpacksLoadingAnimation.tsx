'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import {
  caseStudyCaptionFigureGapClass,
  resolveCaseStudyCaptionLayout,
  type CaseStudyCaptionLayout,
} from '@/src/constants/caseStudy';
import { cn } from '@/src/utils/cn';

const RIVE_SRC = '/images/optimized/jetpacks/rive/jetpacks-loading-flying.riv';

type JetpacksLoadingAnimationProps = {
  captionLabel?: string;
  caption?: ReactNode;
  captionClassName?: string;
  captionLayout?: CaseStudyCaptionLayout;
};

export function JetpacksLoadingAnimation({
  captionLabel,
  caption,
  captionClassName,
  captionLayout,
}: JetpacksLoadingAnimationProps) {
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

  const hasCaption = Boolean(caption || captionLabel);
  const layout = resolveCaseStudyCaptionLayout({
    captionLabel,
    captionClassName,
    captionLayout,
  });

  return (
    <figure
      className={cn(
        'm-0 flex w-full flex-col',
        hasCaption && caseStudyCaptionFigureGapClass(layout)
      )}
    >
      <div
        className="flex w-full items-center justify-center overflow-hidden rounded-[8px] bg-surface-1 px-md py-xl dark:bg-jetpacks-media md:py-2xl"
        aria-label="Jetpacks page loading animation"
      >
        <div className="relative aspect-square w-full max-w-[264px] sm:max-w-[312px] md:max-w-[360px]">
          <RiveComponent className="h-full w-full" />
        </div>
      </div>
      {hasCaption ? (
        <CaseStudyCaption
          caption={caption}
          captionLabel={captionLabel}
          captionClassName={captionClassName}
          captionLayout={captionLayout}
        />
      ) : null}
    </figure>
  );
}
