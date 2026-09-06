import React from 'react';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import { cn } from '@/src/utils/cn';
import { type DojoIconRef, iconSrc } from '@/src/components/ui/dojoIcons';

const EXERCISES_VARIANTS: { icon: DojoIconRef; label: string }[] = [
  { icon: { name: 'exercises', mode: 'light' }, label: 'Light' },
  { icon: { name: 'exercises', mode: 'light', tinted: true }, label: 'Light tinted' },
  { icon: { name: 'exercises', mode: 'dark' }, label: 'Dark' },
  { icon: { name: 'exercises', mode: 'dark', tinted: true }, label: 'Dark tinted' },
];

const TINTED_ICON_NAMES = [
  'case-study',
  'cheatsheets',
  'databook',
  'essay-marker',
  'exam-builder',
  'exemplars-EE',
  'feedback-EE',
  'flashcards',
  'glossary',
  'grade-boundaries',
  'guide-IA',
  'io-grader',
  'lessons',
  'literary-hub',
  'mistakes',
  'notes',
  'past-papers',
  'predicted-papers',
  'question-bank',
  'teach-jojo',
  'textbook',
  'tok-prompts',
  'videos',
  'vocab-practice',
] as const;

const TINTED_ICON_PATH = '/images/optimized/dojo-icons/icons';

const iconLabel = (name: string) => name.replaceAll('-', ' ');

export function DojoIconVariantStrip() {
  return (
    <figure className="m-0 flex w-full flex-col gap-4 md:gap-8">
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
      <CaseStudyCaption
        captionLabel="ICONS"
        caption={
          <p>
            4 icon variants were opted to ensure WCAG color accessibility across different screens
            and appearance themes.
          </p>
        }
        captionLayout="compact"
        className="mb-xs"
      />
    </figure>
  );
}

export function DojoTintedIconGrid() {
  const iconGroups = [TINTED_ICON_NAMES.slice(0, 12), TINTED_ICON_NAMES.slice(12)];

  return (
    <section
      className="w-full overflow-hidden rounded-[8px] bg-white p-sm dark:bg-surface-1 md:p-lg"
      aria-label="RevisionDojo tinted icon collection"
    >
      <div className="mx-auto grid w-full max-w-[1084px] grid-cols-1 gap-3xl lg:grid-cols-2 lg:gap-xl">
        {iconGroups.map((icons, groupIndex) => (
          <div
            key={groupIndex}
            className="grid w-full max-w-[522px] justify-self-center grid-cols-4 gap-[14px]"
          >
            {icons.map((iconName) => {
              const darkSrc = `${TINTED_ICON_PATH}/${iconName}-dark-tinted.svg`;

              return (
                <div
                  key={iconName}
                  className="flex aspect-square w-full max-w-[120px] min-w-0 items-center justify-center overflow-hidden rounded-3xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local SVG artwork remains crisp at every responsive size */}
                  <img
                    src={`${TINTED_ICON_PATH}/${iconName}-light-tinted.svg`}
                    alt={`${iconLabel(iconName)} icon, light tinted`}
                    width={120}
                    height={120}
                    className="block h-full w-full object-cover dark:hidden"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- local SVG artwork remains crisp at every responsive size */}
                  <img
                    src={darkSrc}
                    alt={`${iconLabel(iconName)} icon, dark tinted`}
                    width={120}
                    height={120}
                    className="hidden h-full w-full object-cover dark:block"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
