import React from 'react';
import { cn } from '@/src/utils/cn';

export interface PrettifyMinervaLogoLockupProps {
  className?: string;
  /** Fill the parent and center the lockup (no fixed aspect). Renders a `div`. */
  fill?: boolean;
}

/**
 * Prettify Minerva logo lockup — Figma node 316:480.
 * Icon SVG exported from Figma; wordmark uses Oxygen Mono.
 * `fill` is the highlight-row variant: icon only, fixed light field.
 */
export const PrettifyMinervaLogoLockup: React.FC<PrettifyMinervaLogoLockupProps> = ({
  className,
  fill = false,
}) => {
  const Root = fill ? 'div' : 'figure';

  return (
    <Root
      className={cn(
        'flex w-full items-center justify-center overflow-hidden rounded-[8px]',
        fill
          ? 'h-full min-h-0 bg-prettify-minerva-logo-highlight-bg'
          : 'aspect-[858/312] bg-prettify-minerva-logo-bg',
        className
      )}
      aria-label="Prettify Minerva logo"
      {...(fill ? { role: 'img' as const } : {})}
    >
      {fill ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/optimized/prettify-minerva/prettify-minerva-extension-icon.svg"
          alt=""
          width={96}
          height={96}
          className="size-[4.5rem] shrink-0"
          decoding="async"
        />
      ) : (
        <div className="flex items-center gap-showcase-illustration-sm px-md md:gap-showcase-illustration">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/optimized/prettify-minerva/prettify-minerva-extension-icon.svg"
            alt=""
            width={64}
            height={64}
            className="size-12 shrink-0 md:size-16"
            decoding="async"
          />
          <p
            className={cn(
              'm-0 whitespace-nowrap font-mono uppercase text-prettify-minerva-logo-text',
              'text-[length:var(--type-subtitle-size)] font-normal tracking-[0.08em]',
              'md:text-[length:var(--type-title-size)]'
            )}
          >
            Prettify Minerva
          </p>
        </div>
      )}
    </Root>
  );
};
