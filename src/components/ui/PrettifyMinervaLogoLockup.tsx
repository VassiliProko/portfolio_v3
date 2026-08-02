import React from 'react';
import { cn } from '@/src/utils/cn';

export interface PrettifyMinervaLogoLockupProps {
  className?: string;
}

/**
 * Prettify Minerva logo lockup — Figma node 316:480.
 * Icon SVG exported from Figma; wordmark uses Oxygen Mono.
 */
export const PrettifyMinervaLogoLockup: React.FC<PrettifyMinervaLogoLockupProps> = ({
  className,
}) => {
  return (
    <figure
      className={cn(
        'flex w-full aspect-[858/312] items-center justify-center overflow-hidden rounded-[8px] bg-prettify-minerva-logo-bg',
        className
      )}
      aria-label="Prettify Minerva logo"
    >
      <div className="flex items-center gap-showcase-illustration-sm md:gap-showcase-illustration px-md">
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
    </figure>
  );
};
