import React from 'react';
import { cn } from '@/src/utils/cn';
import {
  DARK_SET,
  DARK_TINTED,
  DojoIconRef,
  LIGHT_SET,
  LIGHT_TINTED,
  iconSrc,
} from '@/src/components/ui/dojoIcons';

function DojoIcon({
  icon,
  className,
  label,
}: {
  icon: DojoIconRef;
  className?: string;
  label?: string;
}) {
  const needsPlate = !icon.tinted;

  return (
    <div
      className={cn(
        'relative aspect-square overflow-hidden rounded-lg',
        needsPlate && icon.mode === 'light' && 'bg-dojo-icons-plate-light',
        needsPlate && icon.mode === 'dark' && 'bg-dojo-icons-plate-dark',
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconSrc(icon)}
        alt={label ?? `${icon.name.replace(/-/g, ' ')} icon`}
        className="block h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function PreviewFrame({
  children,
  className,
  style,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  label: string;
}) {
  return (
    <section
      className={cn(
        'relative aspect-[2/1] w-full overflow-hidden rounded-[8px]',
        className,
      )}
      style={style}
      aria-label={label}
    >
      {children}
    </section>
  );
}

/** Ten 2:1 preview boards — varied grids / modes, never the full set at once. */
export function DojoIconPreviewBoards() {
  return (
    <>
      <PreviewFrame
        label="Light mode icon grid"
        style={{ background: 'var(--gradient-dojo-icons-soft)' }}
        className="flex items-center justify-center p-md md:p-xl"
      >
        <div className="grid w-[min(92%,720px)] grid-cols-4 gap-2xs sm:gap-sm md:gap-md">
          {LIGHT_SET.slice(0, 8).map((icon) => (
            <DojoIcon key={`${icon.name}-${icon.mode}`} icon={icon} />
          ))}
        </div>
      </PreviewFrame>

      <PreviewFrame
        label="Dark mode icon grid"
        className="flex items-center justify-center bg-dojo-icons-canvas-dark p-md md:p-xl"
      >
        <div className="grid w-[min(92%,720px)] grid-cols-4 gap-2xs sm:gap-sm md:gap-md">
          {DARK_SET.slice(0, 8).map((icon) => (
            <DojoIcon key={`${icon.name}-${icon.mode}`} icon={icon} />
          ))}
        </div>
      </PreviewFrame>

      <PreviewFrame
        label="Light tinted icons"
        style={{ background: 'var(--gradient-dojo-icons-mist)' }}
        className="flex items-center justify-center p-md md:p-xl"
      >
        <div className="grid w-[min(88%,560px)] grid-cols-3 gap-sm md:gap-md">
          {LIGHT_TINTED.slice(0, 6).map((icon) => (
            <DojoIcon key={`${icon.name}-lt`} icon={icon} />
          ))}
        </div>
      </PreviewFrame>

      <PreviewFrame
        label="Dark tinted icons"
        className="flex items-center justify-center bg-dojo-icons-canvas-dark p-md md:p-xl"
      >
        <div className="grid w-[min(88%,560px)] grid-cols-3 gap-sm md:gap-md">
          {DARK_TINTED.slice(0, 6).map((icon) => (
            <DojoIcon key={`${icon.name}-dt`} icon={icon} />
          ))}
        </div>
      </PreviewFrame>

      <PreviewFrame
        label="Mixed light, tinted, and dark icons"
        style={{ background: 'var(--gradient-dojo-icons-soft)' }}
        className="flex items-center justify-center p-sm md:p-lg"
      >
        <div className="grid w-[min(94%,680px)] grid-cols-5 gap-2xs sm:gap-xs md:gap-sm">
          {[
            { name: 'flashcards', mode: 'light' as const },
            { name: 'notes', mode: 'light' as const },
            { name: 'case-study', mode: 'light' as const, tinted: true },
            { name: 'question-bank', mode: 'dark' as const },
            { name: 'teach-jojo', mode: 'dark' as const },
            { name: 'grade-boundaries', mode: 'light' as const },
            { name: 'past-papers', mode: 'light' as const },
            { name: 'essay-marker', mode: 'light' as const, tinted: true },
            { name: 'exam-builder', mode: 'dark' as const },
            { name: 'videos', mode: 'dark' as const },
            { name: 'glossary', mode: 'light' as const },
            { name: 'exercises', mode: 'light' as const },
            { name: 'literary-hub', mode: 'light' as const, tinted: true },
            { name: 'cheatsheets', mode: 'dark' as const },
            { name: 'vocab-practice', mode: 'dark' as const },
          ].map((icon) => (
            <DojoIcon
              key={`mix-${icon.name}-${icon.mode}-${icon.tinted ? 't' : 'n'}`}
              icon={icon}
            />
          ))}
        </div>
      </PreviewFrame>

      <PreviewFrame
        label="Featured large icons"
        style={{ background: 'var(--gradient-dojo-icons-mist)' }}
        className="flex items-center justify-center px-lg md:px-3xl"
      >
        <div className="grid w-full max-w-[640px] grid-cols-4 gap-md md:gap-lg">
          {[
            { name: 'flashcards', mode: 'light' as const, tinted: true },
            { name: 'question-bank', mode: 'light' as const, tinted: true },
            { name: 'lessons', mode: 'light' as const, tinted: true },
            { name: 'videos', mode: 'light' as const, tinted: true },
          ].map((icon) => (
            <DojoIcon key={`feat-${icon.name}`} icon={icon} />
          ))}
        </div>
      </PreviewFrame>

      <PreviewFrame
        label="Sparse light icon layout"
        style={{ background: 'var(--gradient-dojo-icons-soft)' }}
        className="flex items-center justify-center p-lg md:p-2xl"
      >
        <div className="grid w-[min(80%,480px)] grid-cols-3 gap-lg md:gap-2xl">
          {[
            { name: 'notes', mode: 'light' as const },
            { name: 'databook', mode: 'light' as const },
            { name: 'guide-IA', mode: 'light' as const },
            { name: 'predicted-papers', mode: 'light' as const },
            { name: 'exemplars-EE', mode: 'light' as const },
            { name: 'feedback-EE', mode: 'light' as const },
          ].map((icon) => (
            <DojoIcon key={`sparse-${icon.name}`} icon={icon} />
          ))}
        </div>
      </PreviewFrame>

      <PreviewFrame
        label="Compact light icon grid"
        className="flex items-center justify-center bg-surface-1 p-sm md:p-lg"
      >
        <div className="grid w-[min(96%,760px)] grid-cols-6 gap-4xs sm:gap-2xs md:gap-xs">
          {LIGHT_SET.slice(0, 12).map((icon) => (
            <DojoIcon key={`compact-${icon.name}`} icon={icon} />
          ))}
        </div>
      </PreviewFrame>

      <PreviewFrame label="Split light and dark modes" className="grid grid-cols-2">
        <div
          className="flex items-center justify-center p-sm md:p-lg"
          style={{ background: 'var(--gradient-dojo-icons-soft)' }}
        >
          <div className="grid w-full max-w-[220px] grid-cols-2 gap-xs md:gap-sm">
            {LIGHT_SET.slice(0, 4).map((icon) => (
              <DojoIcon key={`split-l-${icon.name}`} icon={icon} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center bg-dojo-icons-canvas-dark p-sm md:p-lg">
          <div className="grid w-full max-w-[220px] grid-cols-2 gap-xs md:gap-sm">
            {DARK_SET.slice(0, 4).map((icon) => (
              <DojoIcon key={`split-d-${icon.name}`} icon={icon} />
            ))}
          </div>
        </div>
      </PreviewFrame>

      <PreviewFrame
        label="Light and dark tinted comparison"
        style={{ background: 'var(--gradient-dojo-icons-mist)' }}
        className="flex items-center justify-center gap-lg p-lg md:gap-3xl md:p-2xl"
      >
        <DojoIcon
          icon={{ name: 'teach-jojo', mode: 'light', tinted: true }}
          className="w-[min(38%,220px)]"
          label="Teach Jojo light tinted"
        />
        <DojoIcon
          icon={{ name: 'teach-jojo', mode: 'dark', tinted: true }}
          className="w-[min(38%,220px)]"
          label="Teach Jojo dark tinted"
        />
      </PreviewFrame>
    </>
  );
}
