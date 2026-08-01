import React from 'react';
import { cn } from '@/src/utils/cn';
import { type DojoIconRef, iconSrc } from '@/src/components/ui/dojoIcons';

const EXERCISES_VARIANTS: { icon: DojoIconRef; label: string }[] = [
  { icon: { name: 'exercises', mode: 'light' }, label: 'Light' },
  { icon: { name: 'exercises', mode: 'light', tinted: true }, label: 'Light tinted' },
  { icon: { name: 'exercises', mode: 'dark' }, label: 'Dark' },
  { icon: { name: 'exercises', mode: 'dark', tinted: true }, label: 'Dark tinted' },
];

export function DojoIconVariantStrip() {
  return (
    <section
      className="flex w-full items-center justify-center rounded-[8px] bg-surface-1 px-md py-xl md:py-2xl"
      aria-label="Exercises icon color variants"
    >
      <div className="grid w-full max-w-[720px] grid-cols-2 gap-lg sm:grid-cols-4 sm:gap-md md:gap-lg">
        {EXERCISES_VARIANTS.map(({ icon, label }) => {
          const needsPlate = !icon.tinted;

          return (
            <div key={label} className="flex flex-col items-center gap-sm">
              <div
                className={cn(
                  'relative aspect-square w-full max-w-[140px] overflow-hidden rounded-lg',
                  needsPlate && icon.mode === 'light' && 'bg-dojo-icons-plate-light',
                  needsPlate && icon.mode === 'dark' && 'bg-dojo-icons-plate-dark',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconSrc(icon)}
                  alt={`Exercises icon — ${label.toLowerCase()}`}
                  className="block h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="type-label inline-flex rounded-full bg-surface-2 px-xs py-4xs text-text-muted">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
