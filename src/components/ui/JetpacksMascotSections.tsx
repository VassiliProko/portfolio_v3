import React from 'react';
import { cn } from '@/src/utils/cn';

const ASSETS = '/images/optimized/jetpacks/assets';

type Chick = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

function ChickImage({ chick, className }: { chick: Chick; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG brand assets; keep crisp vectors
    <img
      src={chick.src}
      alt={chick.alt}
      width={chick.width}
      height={chick.height}
      className={cn('pointer-events-none h-auto w-full select-none object-contain', className)}
      loading="lazy"
      decoding="async"
    />
  );
}

const CAST: Chick[] = [
  {
    src: `${ASSETS}/jetpacks-level-1.svg`,
    alt: 'Jetpacks chick, level 1',
    width: 164,
    height: 164,
  },
  {
    src: `${ASSETS}/jetpacks-level-3.svg`,
    alt: 'Jetpacks chick, level 3',
    width: 164,
    height: 164,
  },
  {
    src: `${ASSETS}/jetpacks-level-4.svg`,
    alt: 'Jetpacks chick, level 4',
    width: 164,
    height: 164,
  },
  {
    src: `${ASSETS}/jetpacks-level-5.svg`,
    alt: 'Jetpacks chick, level 5',
    width: 164,
    height: 164,
  },
];

export function JetpacksCastBoard() {
  return (
    <section
      className="w-full overflow-hidden rounded-[8px] bg-surface-1 px-md py-xl dark:bg-jetpacks-media md:px-xl md:py-2xl"
      aria-label="Jetpacks character cast"
    >
      <div className="mx-auto grid w-full max-w-[880px] grid-cols-2 items-end gap-lg sm:grid-cols-4 sm:gap-md md:gap-lg">
        {CAST.map((chick) => (
          <div key={chick.src} className="flex items-end justify-center">
            <ChickImage
              chick={chick}
              className="max-h-[140px] w-auto max-w-[120px] md:max-h-[160px] md:max-w-[140px]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function JetpacksHomeBoard() {
  return (
    <section
      className="w-full overflow-hidden rounded-[8px] bg-surface-1 px-sm py-lg dark:bg-jetpacks-media md:px-lg md:py-xl"
      aria-label="Jetpacks home scene with chicks"
    >
      <ChickImage
        chick={{
          src: `${ASSETS}/jetpacks-home.svg`,
          alt: 'Jetpacks chicks in a home scene with nest and remote',
          width: 1012,
          height: 421,
        }}
        className="mx-auto max-h-[280px] w-full max-w-[920px] md:max-h-[360px]"
      />
    </section>
  );
}
