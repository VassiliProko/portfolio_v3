'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import {
  DUCK_INTRO_COLOR_MODES,
  DUCK_INTRO_DURATION_STEP_S,
  DUCK_INTRO_EASES,
  DUCK_INTRO_EFFECTS,
  DUCK_INTRO_MAX_DITHER_DRIFT_Y,
  DUCK_INTRO_MAX_DURATION_S,
  DUCK_INTRO_MAX_POP_DURATION_MS,
  DUCK_INTRO_MAX_POP_OPACITY_FROM,
  DUCK_INTRO_MAX_POP_SCALE_FROM,
  DUCK_INTRO_MAX_POP_TRANSLATE_Y,
  DUCK_INTRO_MIN_DITHER_DRIFT_Y,
  DUCK_INTRO_MIN_DURATION_S,
  DUCK_INTRO_MIN_POP_DURATION_MS,
  DUCK_INTRO_MIN_POP_OPACITY_FROM,
  DUCK_INTRO_MIN_POP_SCALE_FROM,
  DUCK_INTRO_MIN_POP_TRANSLATE_Y,
  DUCK_INTRO_POP_DURATION_STEP_MS,
  type DuckIntroColorModeId,
  type DuckIntroEaseId,
  type DuckIntroEffectId,
} from '@/src/components/ui/duckIntro/duckIntroSettings';
import { cn } from '@/src/utils/cn';

type DuckIntroDevPanelProps = {
  effectId: DuckIntroEffectId;
  colorModeId: DuckIntroColorModeId;
  durationS: number;
  popDurationMs: number;
  popScaleFrom: number;
  popTranslateY: number;
  popOpacityFrom: number;
  popEaseId: DuckIntroEaseId;
  ditherDriftY: number;
  ditherDriftEaseId: DuckIntroEaseId;
  playing: boolean;
  defaultsSaved: boolean;
  onEffectChange: (effectId: DuckIntroEffectId) => void;
  onColorModeChange: (colorModeId: DuckIntroColorModeId) => void;
  onDurationChange: (durationS: number) => void;
  onPopDurationChange: (ms: number) => void;
  onPopScaleFromChange: (value: number) => void;
  onPopTranslateYChange: (value: number) => void;
  onPopOpacityFromChange: (value: number) => void;
  onPopEaseChange: (easeId: DuckIntroEaseId) => void;
  onDitherDriftYChange: (value: number) => void;
  onDitherDriftEaseChange: (easeId: DuckIntroEaseId) => void;
  onPlay: () => void;
  onSetDefault: () => void;
};

function SliderField({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <label htmlFor={id} className="font-mono text-xs uppercase tracking-[0.12em]">
          {label}
        </label>
        <span className="font-mono text-sm tabular-nums text-text-muted">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary-base"
        disabled={disabled}
      />
    </div>
  );
}

function OptionList<T extends string>({
  legend,
  name,
  options,
  value,
  disabled,
  onChange,
}: {
  legend: string;
  name: string;
  options: { id: T; label: string; description: string }[];
  value: T;
  disabled: boolean;
  onChange: (id: T) => void;
}) {
  return (
    <fieldset className="mb-8 min-w-0" disabled={disabled}>
      <legend className="mb-3 font-mono text-xs uppercase tracking-[0.12em]">{legend}</legend>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <label
              key={option.id}
              className={cn(
                'cursor-pointer border border-border-base bg-background p-[15px] transition-colors duration-[60ms] ease-snap',
                selected && 'border-primary-base bg-ghost-hover',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name={name}
                  value={option.id}
                  checked={selected}
                  onChange={() => onChange(option.id)}
                  className="mt-1 accent-primary-base"
                />
                <span className="min-w-0">
                  <span className="block font-sans text-sm font-bold">{option.label}</span>
                  <span className="mt-1 block font-sans text-xs text-text-muted">
                    {option.description}
                  </span>
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export const DuckIntroDevPanel: React.FC<DuckIntroDevPanelProps> = ({
  effectId,
  colorModeId,
  durationS,
  popDurationMs,
  popScaleFrom,
  popTranslateY,
  popOpacityFrom,
  popEaseId,
  ditherDriftY,
  ditherDriftEaseId,
  playing,
  defaultsSaved,
  onEffectChange,
  onColorModeChange,
  onDurationChange,
  onPopDurationChange,
  onPopScaleFromChange,
  onPopTranslateYChange,
  onPopOpacityFromChange,
  onPopEaseChange,
  onDitherDriftYChange,
  onDitherDriftEaseChange,
  onPlay,
  onSetDefault,
}) => {
  return (
    <aside
      className="pointer-events-auto fixed bottom-0 right-0 top-0 z-[60] flex w-[min(100%,320px)] flex-col border-l border-border-base bg-surface-1 text-text"
      aria-label="Duck intro effect playground"
    >
      <div className="border-b border-border-divider px-5 py-5">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">Intro playground</p>
        <h2 className="mt-2 font-sans text-lg font-bold">Duck dither</h2>
        <p className="mt-2 font-sans text-sm text-text-muted">
          Pop in, then dissolve. Tweak color + timing — home stays blank until you wire production.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">Pop up</p>
        <SliderField
          id="duck-intro-pop-duration"
          label="Pop duration"
          value={popDurationMs}
          display={`${popDurationMs}ms`}
          min={DUCK_INTRO_MIN_POP_DURATION_MS}
          max={DUCK_INTRO_MAX_POP_DURATION_MS}
          step={DUCK_INTRO_POP_DURATION_STEP_MS}
          disabled={playing}
          onChange={onPopDurationChange}
        />
        <SliderField
          id="duck-intro-pop-scale"
          label="Start scale"
          value={popScaleFrom}
          display={`${popScaleFrom.toFixed(2)}×`}
          min={DUCK_INTRO_MIN_POP_SCALE_FROM}
          max={DUCK_INTRO_MAX_POP_SCALE_FROM}
          step={0.01}
          disabled={playing}
          onChange={onPopScaleFromChange}
        />
        <SliderField
          id="duck-intro-pop-translate"
          label="Translate up"
          value={popTranslateY}
          display={`${popTranslateY.toFixed(2)}× h`}
          min={DUCK_INTRO_MIN_POP_TRANSLATE_Y}
          max={DUCK_INTRO_MAX_POP_TRANSLATE_Y}
          step={0.05}
          disabled={playing}
          onChange={onPopTranslateYChange}
        />
        <SliderField
          id="duck-intro-pop-opacity"
          label="Start opacity"
          value={popOpacityFrom}
          display={popOpacityFrom.toFixed(2)}
          min={DUCK_INTRO_MIN_POP_OPACITY_FROM}
          max={DUCK_INTRO_MAX_POP_OPACITY_FROM}
          step={0.01}
          disabled={playing}
          onChange={onPopOpacityFromChange}
        />
        <OptionList
          legend="Pop easing"
          name="duck-intro-pop-ease"
          options={DUCK_INTRO_EASES}
          value={popEaseId}
          disabled={playing}
          onChange={onPopEaseChange}
        />

        <p className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">Dither</p>
        <SliderField
          id="duck-intro-duration"
          label="Dither duration"
          value={durationS}
          display={`${durationS.toFixed(2)}s`}
          min={DUCK_INTRO_MIN_DURATION_S}
          max={DUCK_INTRO_MAX_DURATION_S}
          step={DUCK_INTRO_DURATION_STEP_S}
          disabled={playing}
          onChange={onDurationChange}
        />
        <SliderField
          id="duck-intro-dither-drift"
          label="Drift up"
          value={ditherDriftY}
          display={`${ditherDriftY.toFixed(2)}× h`}
          min={DUCK_INTRO_MIN_DITHER_DRIFT_Y}
          max={DUCK_INTRO_MAX_DITHER_DRIFT_Y}
          step={0.01}
          disabled={playing}
          onChange={onDitherDriftYChange}
        />
        <OptionList
          legend="Drift easing"
          name="duck-intro-dither-drift-ease"
          options={DUCK_INTRO_EASES}
          value={ditherDriftEaseId}
          disabled={playing}
          onChange={onDitherDriftEaseChange}
        />

        <OptionList
          legend="Color mode"
          name="duck-intro-color"
          options={DUCK_INTRO_COLOR_MODES}
          value={colorModeId}
          disabled={playing}
          onChange={onColorModeChange}
        />

        <OptionList
          legend="Effect"
          name="duck-intro-effect"
          options={DUCK_INTRO_EFFECTS}
          value={effectId}
          disabled={playing}
          onChange={onEffectChange}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-border-divider px-5 py-5">
        <Button type="button" variant="primary" onClick={onPlay} disabled={playing} className="w-full gap-2">
          <Play size={16} strokeWidth={2} aria-hidden />
          {playing ? 'Playing…' : 'Play'}
        </Button>
        <Button type="button" variant="secondary" onClick={onSetDefault} disabled={playing} className="w-full">
          {defaultsSaved ? 'Saved as default' : 'Set as default'}
        </Button>
      </div>
    </aside>
  );
};
