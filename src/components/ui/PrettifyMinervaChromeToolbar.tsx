'use client';

import React from 'react';
import { DotsThreeVertical, PuzzlePiece } from '@phosphor-icons/react';
import { useReducedMotion } from 'motion/react';
import { motion } from '@/src/tokens/motion';
import { cn } from '@/src/utils/cn';

const ICON_MS = 500;

export interface PrettifyMinervaChromeToolbarProps {
  showExtension?: boolean;
  className?: string;
}

/** Compact Chrome toolbar crop — theme-aware omnibox + extension slot. */
export const PrettifyMinervaChromeToolbar: React.FC<PrettifyMinervaChromeToolbarProps> = ({
  showExtension = false,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const transitionMs = prefersReducedMotion ? '0ms' : `${ICON_MS}ms`;

  return (
    <div
      className={cn(
        'flex h-14 w-full items-center overflow-hidden rounded-[8px]',
        'bg-prettify-minerva-chrome-toolbar-bg pr-md md:h-16 md:pr-lg',
        className
      )}
      aria-hidden
    >
      <div className="h-8 min-w-0 flex-1 rounded-r-full bg-prettify-minerva-chrome-toolbar-surface" />

      <div className="flex shrink-0 items-center gap-sm pl-sm md:gap-md md:pl-md">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden',
            'motion-reduce:w-5 motion-reduce:opacity-100 motion-reduce:transition-none',
            showExtension ? 'w-5 opacity-100' : 'w-0 opacity-0'
          )}
          style={{
            transitionProperty: 'width, opacity',
            transitionDuration: transitionMs,
            transitionTimingFunction: motion.easing.move,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/optimized/prettify-minerva/prettify-minerva-extension-icon.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 max-w-none shrink-0 rounded-[4px]"
            decoding="async"
          />
        </div>

        <PuzzlePiece
          className="size-5 shrink-0 text-prettify-minerva-chrome-toolbar-fg"
          size={20}
        />

        <span className="h-5 w-px shrink-0 bg-prettify-minerva-chrome-toolbar-muted opacity-50" />

        <DotsThreeVertical
          className="size-5 shrink-0 text-prettify-minerva-chrome-toolbar-fg"
          size={20}
        />
      </div>
    </div>
  );
};
