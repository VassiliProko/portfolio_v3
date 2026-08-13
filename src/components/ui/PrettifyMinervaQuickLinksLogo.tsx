import React from 'react';
import Image from 'next/image';
import { PrettifyMinervaLogoLockup } from '@/src/components/ui/PrettifyMinervaLogoLockup';
import { cn } from '@/src/utils/cn';

const QUICK_LINKS_SRC =
  '/images/optimized/prettify-minerva/minerva-quick-links-highlight.jpg';
const QUICK_LINKS_WIDTH = 1620;
const QUICK_LINKS_HEIGHT = 1140;

const MEDIA_GAP_CLASS = 'gap-2 md:gap-4';

/**
 * Quick Links highlight + logo lockup.
 * Row from md; stacked figures on mobile so each caption stays under its media.
 */
export const PrettifyMinervaQuickLinksLogo: React.FC = () => {
  return (
    <div
      className={cn(
        'flex w-full flex-col',
        MEDIA_GAP_CLASS,
        'md:grid md:grid-cols-2 md:grid-rows-[auto_auto] md:gap-x-4 md:gap-y-2xs'
      )}
    >
      <figure className="flex flex-col gap-2xs md:contents">
        <div className="relative w-full overflow-hidden rounded-[8px] bg-surface-2 md:col-start-1 md:row-start-1">
          <Image
            src={QUICK_LINKS_SRC}
            alt="Quick Links editor with drag handles for e-Bills, transcript, registration, and study away"
            width={QUICK_LINKS_WIDTH}
            height={QUICK_LINKS_HEIGHT}
            className="block h-auto w-full"
            sizes="(max-width: 768px) 100vw, min(50vw, 600px)"
          />
        </div>
        <figcaption className="type-paragraph m-0 text-text md:col-start-1 md:row-start-2">
          To improve convenience, I added cookie-stored Quick Links available right
          underneath the search bar.
        </figcaption>
      </figure>
      <figure className="flex flex-col gap-2xs md:contents">
        <div
          className={cn(
            'overflow-hidden rounded-[8px]',
            'aspect-[1620/1140] md:aspect-auto md:h-full',
            'md:col-start-2 md:row-start-1'
          )}
        >
          <PrettifyMinervaLogoLockup fill />
        </div>
        <figcaption className="type-paragraph m-0 text-text md:col-start-2 md:row-start-2">
          Logo was inspired by the Made by McGill campaign.
        </figcaption>
      </figure>
    </div>
  );
};
