'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { SlidersHorizontal, Shuffle, X } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import {
  DARK_SET,
  DARK_TINTED,
  DojoIconRef,
  LIGHT_SET,
  LIGHT_TINTED,
  iconSrc,
  mixedPool,
  pickIcons,
} from '@/src/components/ui/dojoIcons';

type Pattern = 'grid' | 'sparse' | 'compact' | 'featured' | 'mixed-columns' | 'split';
type VariantFilter = 'light' | 'dark' | 'light-tinted' | 'dark-tinted' | 'mixed';
type BoardBackground = 'soft' | 'mist' | 'dark' | 'surface';
type GapDensity = 'tight' | 'normal' | 'loose';

type HeroConfig = {
  pattern: Pattern;
  count: number;
  variant: VariantFilter;
  background: BoardBackground;
  columns: number;
  gap: GapDensity;
  seed: number;
};

const DEFAULT_CONFIG: HeroConfig = {
  pattern: 'mixed-columns',
  count: 15,
  variant: 'mixed',
  background: 'soft',
  columns: 5,
  gap: 'normal',
  seed: 7,
};

const COUNT_OPTIONS = [4, 6, 8, 9, 12, 15, 18, 21] as const;
const COLUMN_OPTIONS = [2, 3, 4, 5, 6] as const;

const PATTERN_OPTIONS: { value: Pattern; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'sparse', label: 'Sparse' },
  { value: 'compact', label: 'Compact' },
  { value: 'featured', label: 'Featured' },
  { value: 'mixed-columns', label: 'Mixed cols' },
  { value: 'split', label: 'Split' },
];

const VARIANT_OPTIONS: { value: VariantFilter; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'light-tinted', label: 'Light tinted' },
  { value: 'dark-tinted', label: 'Dark tinted' },
  { value: 'mixed', label: 'Mixed' },
];

const BACKGROUND_OPTIONS: { value: BoardBackground; label: string }[] = [
  { value: 'soft', label: 'Soft' },
  { value: 'mist', label: 'Mist' },
  { value: 'dark', label: 'Dark' },
  { value: 'surface', label: 'Surface' },
];

const GAP_OPTIONS: { value: GapDensity; label: string }[] = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'loose', label: 'Loose' },
];

function poolForVariant(variant: VariantFilter): DojoIconRef[] {
  switch (variant) {
    case 'light':
      return LIGHT_SET;
    case 'dark':
      return DARK_SET;
    case 'light-tinted':
      return LIGHT_TINTED;
    case 'dark-tinted':
      return DARK_TINTED;
    case 'mixed':
      return mixedPool();
  }
}

function DojoIcon({
  icon,
  className,
  priority = false,
}: {
  icon: DojoIconRef;
  className?: string;
  priority?: boolean;
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
        alt=""
        className="block h-full w-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  columns = 2,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  columns?: number;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="type-label mb-2xs px-0 text-text-subtle">{label}</legend>
      <div
        className="grid gap-4xs"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                'type-label truncate rounded-sm px-2xs py-2xs text-center',
                'transition-colors duration-[60ms] ease-snap',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
                selected
                  ? 'bg-text text-text-inverted-1'
                  : 'bg-surface-2 text-text-muted hover:bg-surface-3 hover:text-text',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function boardBackgroundStyle(background: BoardBackground): React.CSSProperties | undefined {
  if (background === 'soft') return { background: 'var(--gradient-dojo-icons-soft)' };
  if (background === 'mist') return { background: 'var(--gradient-dojo-icons-mist)' };
  return undefined;
}

function boardBackgroundClass(background: BoardBackground) {
  if (background === 'dark') return 'bg-dojo-icons-canvas-dark';
  if (background === 'surface') return 'bg-surface-1';
  return undefined;
}

function gapClass(gap: GapDensity, pattern: Pattern) {
  if (pattern === 'sparse') {
    return gap === 'tight' ? 'gap-md' : gap === 'loose' ? 'gap-3xl' : 'gap-xl';
  }
  if (pattern === 'compact') {
    return gap === 'tight' ? 'gap-4xs' : gap === 'loose' ? 'gap-2xs' : 'gap-4xs';
  }
  if (pattern === 'featured') {
    return gap === 'tight' ? 'gap-sm' : gap === 'loose' ? 'gap-2xl' : 'gap-lg';
  }
  return gap === 'tight' ? 'gap-4xs sm:gap-2xs' : gap === 'loose' ? 'gap-sm md:gap-md' : 'gap-2xs sm:gap-xs md:gap-sm';
}

function paddingClass(pattern: Pattern) {
  switch (pattern) {
    case 'sparse':
      return 'p-lg md:p-2xl';
    case 'compact':
      return 'p-sm md:p-md';
    case 'featured':
      return 'px-lg md:px-3xl py-md';
    default:
      return 'p-md md:p-lg';
  }
}

function widthClass(pattern: Pattern) {
  switch (pattern) {
    case 'sparse':
      return 'w-[min(78%,520px)]';
    case 'compact':
      return 'w-[min(96%,780px)]';
    case 'featured':
      return 'w-[min(88%,640px)]';
    case 'mixed-columns':
      return 'w-[min(94%,720px)]';
    default:
      return 'w-[min(92%,680px)]';
  }
}

export function DojoIconHeroBoard() {
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const icons = useMemo(
    () => pickIcons(poolForVariant(config.variant), config.count, config.seed),
    [config.variant, config.count, config.seed],
  );

  const splitHalf = Math.ceil(icons.length / 2);
  const leftIcons = icons.slice(0, splitHalf);
  const rightIcons = icons.slice(splitHalf);

  useEffect(() => {
    if (!panelOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanelOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setPanelOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [panelOpen]);

  const update = <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
  } as const;

  return (
    <div ref={rootRef} className="relative w-full">
      <section
        className={cn(
          'relative aspect-[2/1] w-full overflow-hidden rounded-[8px]',
          boardBackgroundClass(config.background),
          paddingClass(config.pattern),
          config.pattern === 'split' ? 'grid grid-cols-2 p-0' : 'flex items-center justify-center',
        )}
        style={config.pattern === 'split' ? undefined : boardBackgroundStyle(config.background)}
        aria-label="RevisionDojo icons hero preview"
      >
        {config.pattern === 'split' ? (
          <>
            <div
              className="flex items-center justify-center p-sm md:p-lg"
              style={boardBackgroundStyle('soft')}
            >
              <div
                className={cn('grid w-full max-w-[240px]', gapClass(config.gap, 'grid'))}
                style={{ gridTemplateColumns: `repeat(${Math.min(config.columns, 3)}, minmax(0, 1fr))` }}
              >
                {leftIcons.map((icon, index) => (
                  <DojoIcon
                    key={`left-${icon.name}-${icon.mode}-${icon.tinted ? 't' : 'n'}-${index}`}
                    icon={{
                      ...icon,
                      mode: 'light',
                      tinted:
                        config.variant === 'light-tinted' ||
                        config.variant === 'dark-tinted' ||
                        (config.variant === 'mixed' && Boolean(icon.tinted)),
                    }}
                    priority={index < 4}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center bg-dojo-icons-canvas-dark p-sm md:p-lg">
              <div
                className={cn('grid w-full max-w-[240px]', gapClass(config.gap, 'grid'))}
                style={{ gridTemplateColumns: `repeat(${Math.min(config.columns, 3)}, minmax(0, 1fr))` }}
              >
                {rightIcons.map((icon, index) => (
                  <DojoIcon
                    key={`right-${icon.name}-${icon.mode}-${icon.tinted ? 't' : 'n'}-${index}`}
                    icon={{
                      ...icon,
                      mode: 'dark',
                      tinted:
                        config.variant === 'light-tinted' ||
                        config.variant === 'dark-tinted' ||
                        (config.variant === 'mixed' && Boolean(icon.tinted)),
                    }}
                    priority={index < 4}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={cn('grid', widthClass(config.pattern), gapClass(config.gap, config.pattern))} style={gridStyle}>
            {icons.map((icon, index) => (
              <DojoIcon
                key={`${icon.name}-${icon.mode}-${icon.tinted ? 't' : 'n'}-${index}`}
                icon={icon}
                priority={index < 8}
              />
            ))}
          </div>
        )}
      </section>

      <button
        ref={toggleRef}
        type="button"
        aria-expanded={panelOpen}
        aria-controls={panelId}
        onClick={() => setPanelOpen((open) => !open)}
        className={cn(
          'absolute bottom-sm right-sm z-20 inline-flex h-10 items-center gap-2xs rounded-sm bg-surface-dark-1 px-sm text-text-inverted-1',
          'type-label shadow-highlight-reel-video-outer',
          'transition-colors duration-[60ms] ease-snap hover:bg-surface-dark-2',
          'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
        )}
      >
        <SlidersHorizontal className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        Controls
      </button>

      {panelOpen ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label="Hero icon board controls"
          className={cn(
            'absolute bottom-[calc(var(--spacing-sm)+2.75rem)] right-sm z-30 w-[min(100%-1.5rem,320px)]',
            'rounded-[8px] border border-border-base bg-surface-1 p-sm shadow-highlight-reel-video-outer',
            'flex flex-col gap-sm',
          )}
        >
          <div className="flex items-center justify-between gap-2xs">
            <p className="type-label m-0 text-text">Hero controls</p>
            <button
              type="button"
              aria-label="Close controls"
              onClick={() => setPanelOpen(false)}
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-sm text-text-muted',
                'transition-colors duration-[60ms] ease-snap hover:bg-surface-1 hover:text-text',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
              )}
            >
              <X className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <SegmentedControl
            label="Pattern"
            value={config.pattern}
            options={PATTERN_OPTIONS}
            onChange={(pattern) => update('pattern', pattern)}
            columns={3}
          />

          <SegmentedControl
            label="Variants"
            value={config.variant}
            options={VARIANT_OPTIONS}
            onChange={(variant) => update('variant', variant)}
            columns={2}
          />

          <SegmentedControl
            label="Background"
            value={config.background}
            options={BACKGROUND_OPTIONS}
            onChange={(background) => update('background', background)}
            columns={4}
          />

          <fieldset className="m-0 border-0 p-0">
            <legend className="type-label mb-2xs px-0 text-text-subtle">Icon count</legend>
            <div className="grid grid-cols-4 gap-4xs">
              {COUNT_OPTIONS.map((count) => {
                const selected = count === config.count;
                return (
                  <button
                    key={count}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update('count', count)}
                    className={cn(
                      'type-label rounded-sm px-2xs py-2xs',
                      'transition-colors duration-[60ms] ease-snap',
                      'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
                      selected
                        ? 'bg-text text-text-inverted-1'
                        : 'bg-surface-2 text-text-muted hover:bg-surface-3 hover:text-text',
                    )}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="m-0 border-0 p-0">
            <legend className="type-label mb-2xs px-0 text-text-subtle">Columns</legend>
            <div className="grid grid-cols-5 gap-4xs">
              {COLUMN_OPTIONS.map((columns) => {
                const selected = columns === config.columns;
                return (
                  <button
                    key={columns}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update('columns', columns)}
                    className={cn(
                      'type-label rounded-sm px-2xs py-2xs',
                      'transition-colors duration-[60ms] ease-snap',
                      'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
                      selected
                        ? 'bg-text text-text-inverted-1'
                        : 'bg-surface-2 text-text-muted hover:bg-surface-3 hover:text-text',
                    )}
                  >
                    {columns}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <SegmentedControl
            label="Spacing"
            value={config.gap}
            options={GAP_OPTIONS}
            onChange={(gap) => update('gap', gap)}
            columns={3}
          />

          <div className="flex gap-2xs">
            <button
              type="button"
              onClick={() => update('seed', (config.seed % 9999) + 1)}
              className={cn(
                'inline-flex h-10 flex-1 items-center justify-center gap-2xs rounded-sm bg-surface-2 px-sm',
                'type-label text-text-muted',
                'transition-colors duration-[60ms] ease-snap hover:bg-surface-3 hover:text-text',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
              )}
            >
              <Shuffle className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              Shuffle
            </button>
            <button
              type="button"
              onClick={() => setConfig(DEFAULT_CONFIG)}
              className={cn(
                'inline-flex h-10 flex-1 items-center justify-center rounded-sm bg-surface-2 px-sm',
                'type-label text-text-muted',
                'transition-colors duration-[60ms] ease-snap hover:bg-surface-3 hover:text-text',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
              )}
            >
              Reset
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
