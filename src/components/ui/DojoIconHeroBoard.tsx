import React from 'react';
import { DARK_TINTED, iconSrc } from '@/src/components/ui/dojoIcons';

const HERO_ICONS = DARK_TINTED.slice(0, 18);

export function DojoIconHeroBoard() {
  return (
    <section
      className="relative flex aspect-[2/1] w-full items-center justify-center overflow-hidden rounded-[8px] p-md md:p-lg"
      style={{ background: 'var(--gradient-dojo-icons-mist)' }}
      aria-label="RevisionDojo icons hero preview"
    >
      <div className="grid w-[min(92%,720px)] grid-cols-6 gap-2xs sm:gap-xs md:gap-sm">
        {HERO_ICONS.map((icon) => (
          <div
            key={`${icon.name}-${icon.mode}-tinted`}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconSrc(icon)}
              alt=""
              className="block h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
