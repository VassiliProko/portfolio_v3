export const DUCK_INTRO_GRID = 16;
/** Navbar logo is 36px; intro duck targets ~5× that with integer cells for crisp pixels */
export const DUCK_INTRO_NAV_LOGO_PX = 36;
export const DUCK_INTRO_SCALE = 5;
/** 12px per source pixel → 192px (~5.3× nav logo) */
export const DUCK_INTRO_CELL_PX = 12;
export const DUCK_INTRO_DISPLAY_PX = DUCK_INTRO_GRID * DUCK_INTRO_CELL_PX;

export const DUCK_INTRO_DEFAULT_DURATION_S = 0.8;
export const DUCK_INTRO_MIN_DURATION_S = 0.25;
export const DUCK_INTRO_MAX_DURATION_S = 3;
export const DUCK_INTRO_DURATION_STEP_S = 0.05;

export const DUCK_INTRO_DEFAULT_POP_DURATION_MS = 350;
export const DUCK_INTRO_MIN_POP_DURATION_MS = 150;
export const DUCK_INTRO_MAX_POP_DURATION_MS = 800;
export const DUCK_INTRO_POP_DURATION_STEP_MS = 10;

export const DUCK_INTRO_DEFAULT_POP_SCALE_FROM = 1;
export const DUCK_INTRO_MIN_POP_SCALE_FROM = 0.5;
export const DUCK_INTRO_MAX_POP_SCALE_FROM = 1;

export const DUCK_INTRO_DEFAULT_POP_TRANSLATE_Y = 0.45;
export const DUCK_INTRO_MIN_POP_TRANSLATE_Y = 0;
export const DUCK_INTRO_MAX_POP_TRANSLATE_Y = 1.5;

export const DUCK_INTRO_DEFAULT_POP_OPACITY_FROM = 0.48;
export const DUCK_INTRO_MIN_POP_OPACITY_FROM = 0;
export const DUCK_INTRO_MAX_POP_OPACITY_FROM = 1;

/** Drift upward during dither, as a multiple of duck height */
export const DUCK_INTRO_DEFAULT_DITHER_DRIFT_Y = 0.15;
export const DUCK_INTRO_MIN_DITHER_DRIFT_Y = 0;
export const DUCK_INTRO_MAX_DITHER_DRIFT_Y = 1;

/**
 * While true, home stays on the duck playground (sidebar + play).
 * Flip to false once an effect is chosen to run the real home enter sequence.
 */
export const DUCK_INTRO_PLAYGROUND = true;

export const DUCK_INTRO_STORAGE_KEY = 'duck-intro-defaults-v3';

export type DuckIntroEffectId =
  | 'random-dissolve'
  | 'bayer-fade'
  | 'chromatic-scramble'
  | 'noise-erosion'
  | 'scan-wipe'
  | 'block-glitch';

export type DuckIntroColorModeId =
  | 'preserve'
  | 'monochrome'
  | 'desaturate'
  | 'brightness-up'
  | 'brightness-down'
  | 'brand-soft'
  | 'accent-soft'
  | 'palette-scramble';

export type DuckIntroEaseId =
  | 'snap'
  | 'ease-out'
  | 'ease-in'
  | 'ease-in-out'
  | 'soft'
  | 'linear';

export type DuckIntroEffectOption = {
  id: DuckIntroEffectId;
  label: string;
  description: string;
};

export type DuckIntroColorModeOption = {
  id: DuckIntroColorModeId;
  label: string;
  description: string;
};

export type DuckIntroEaseOption = {
  id: DuckIntroEaseId;
  label: string;
  description: string;
  /** CSS / Motion cubic-bezier, or 'linear' */
  ease: [number, number, number, number] | 'linear';
};

export const DUCK_INTRO_EFFECTS: DuckIntroEffectOption[] = [
  {
    id: 'random-dissolve',
    label: 'Random dissolve',
    description: 'Pixels flash, then drop out by chance.',
  },
  {
    id: 'bayer-fade',
    label: 'Bayer dither',
    description: 'Ordered dither threshold dissolve.',
  },
  {
    id: 'chromatic-scramble',
    label: 'Chromatic scramble',
    description: 'Whole duck noise-waves, then pixels peel away.',
  },
  {
    id: 'noise-erosion',
    label: 'Noise erosion',
    description: 'Holes eat the silhouette while survivors jitter.',
  },
  {
    id: 'scan-wipe',
    label: 'Scan wipe',
    description: 'Bottom-to-top wipe with per-pixel dither jitter.',
  },
  {
    id: 'block-glitch',
    label: 'Block glitch',
    description: '2×2 blocks scramble then collapse in chunks.',
  },
];

export const DUCK_INTRO_COLOR_MODES: DuckIntroColorModeOption[] = [
  {
    id: 'preserve',
    label: 'Preserve colors',
    description: 'Keep original duck colors; only dissolve alpha.',
  },
  {
    id: 'monochrome',
    label: 'Monochrome',
    description: 'Fade toward grayscale as pixels drop out.',
  },
  {
    id: 'desaturate',
    label: 'Desaturate',
    description: 'Pull saturation down near the dissolve edge.',
  },
  {
    id: 'brightness-up',
    label: 'Brighten out',
    description: 'Pixels wash brighter before vanishing.',
  },
  {
    id: 'brightness-down',
    label: 'Darken out',
    description: 'Pixels dim toward black before vanishing.',
  },
  {
    id: 'brand-soft',
    label: 'Soft brand cyan',
    description: 'Gentle mix into primary cyan at the edge.',
  },
  {
    id: 'accent-soft',
    label: 'Soft accent gold',
    description: 'Gentle mix into accent gold at the edge.',
  },
  {
    id: 'palette-scramble',
    label: 'Palette scramble',
    description: 'Hard random palette flicker (original look).',
  },
];

export const DUCK_INTRO_EASES: DuckIntroEaseOption[] = [
  {
    id: 'snap',
    label: 'Snap',
    description: 'Design-system enter curve — fast settle.',
    ease: [0, 0.9, 0.1, 1],
  },
  {
    id: 'ease-out',
    label: 'Ease out',
    description: 'Quick start, soft landing.',
    ease: [0.22, 1, 0.36, 1],
  },
  {
    id: 'ease-in',
    label: 'Ease in',
    description: 'Gentle start, accelerates out.',
    ease: [0.4, 0, 1, 1],
  },
  {
    id: 'ease-in-out',
    label: 'Ease in-out',
    description: 'Soft both ends.',
    ease: [0.4, 0, 0.2, 1],
  },
  {
    id: 'soft',
    label: 'Soft',
    description: 'Long smooth decelerate.',
    ease: [0.16, 1, 0.3, 1],
  },
  {
    id: 'linear',
    label: 'Linear',
    description: 'Constant speed.',
    ease: 'linear',
  },
];

export const DUCK_INTRO_DEFAULT_EFFECT: DuckIntroEffectId = 'scan-wipe';
export const DUCK_INTRO_DEFAULT_COLOR_MODE: DuckIntroColorModeId = 'brightness-up';
export const DUCK_INTRO_DEFAULT_POP_EASE: DuckIntroEaseId = 'ease-out';
export const DUCK_INTRO_DEFAULT_DITHER_DRIFT_EASE: DuckIntroEaseId = 'ease-out';

export type DuckIntroDefaults = {
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
};

export function getBuiltInDuckIntroDefaults(): DuckIntroDefaults {
  return {
    effectId: DUCK_INTRO_DEFAULT_EFFECT,
    colorModeId: DUCK_INTRO_DEFAULT_COLOR_MODE,
    durationS: DUCK_INTRO_DEFAULT_DURATION_S,
    popDurationMs: DUCK_INTRO_DEFAULT_POP_DURATION_MS,
    popScaleFrom: DUCK_INTRO_DEFAULT_POP_SCALE_FROM,
    popTranslateY: DUCK_INTRO_DEFAULT_POP_TRANSLATE_Y,
    popOpacityFrom: DUCK_INTRO_DEFAULT_POP_OPACITY_FROM,
    popEaseId: DUCK_INTRO_DEFAULT_POP_EASE,
    ditherDriftY: DUCK_INTRO_DEFAULT_DITHER_DRIFT_Y,
    ditherDriftEaseId: DUCK_INTRO_DEFAULT_DITHER_DRIFT_EASE,
  };
}

export function clampDuckIntroDuration(durationS: number): number {
  return Math.min(
    DUCK_INTRO_MAX_DURATION_S,
    Math.max(DUCK_INTRO_MIN_DURATION_S, Number(durationS.toFixed(2))),
  );
}

export function clampPopDurationMs(value: number): number {
  return Math.min(
    DUCK_INTRO_MAX_POP_DURATION_MS,
    Math.max(DUCK_INTRO_MIN_POP_DURATION_MS, Math.round(value)),
  );
}

export function clampPopScaleFrom(value: number): number {
  return Math.min(
    DUCK_INTRO_MAX_POP_SCALE_FROM,
    Math.max(DUCK_INTRO_MIN_POP_SCALE_FROM, Number(value.toFixed(2))),
  );
}

export function clampPopTranslateY(value: number): number {
  return Math.min(
    DUCK_INTRO_MAX_POP_TRANSLATE_Y,
    Math.max(DUCK_INTRO_MIN_POP_TRANSLATE_Y, Number(value.toFixed(2))),
  );
}

export function clampPopOpacityFrom(value: number): number {
  return Math.min(
    DUCK_INTRO_MAX_POP_OPACITY_FROM,
    Math.max(DUCK_INTRO_MIN_POP_OPACITY_FROM, Number(value.toFixed(2))),
  );
}

export function clampDitherDriftY(value: number): number {
  return Math.min(
    DUCK_INTRO_MAX_DITHER_DRIFT_Y,
    Math.max(DUCK_INTRO_MIN_DITHER_DRIFT_Y, Number(value.toFixed(2))),
  );
}

export function isDuckIntroEffectId(value: unknown): value is DuckIntroEffectId {
  return DUCK_INTRO_EFFECTS.some((effect) => effect.id === value);
}

export function isDuckIntroColorModeId(value: unknown): value is DuckIntroColorModeId {
  return DUCK_INTRO_COLOR_MODES.some((mode) => mode.id === value);
}

export function isDuckIntroEaseId(value: unknown): value is DuckIntroEaseId {
  return DUCK_INTRO_EASES.some((ease) => ease.id === value);
}

export function getDuckIntroEase(easeId: DuckIntroEaseId): DuckIntroEaseOption['ease'] {
  return DUCK_INTRO_EASES.find((ease) => ease.id === easeId)?.ease ?? [0.22, 1, 0.36, 1];
}

export function readDuckIntroDefaults(): DuckIntroDefaults {
  const builtIn = getBuiltInDuckIntroDefaults();
  if (typeof window === 'undefined') {
    return builtIn;
  }

  try {
    const raw = localStorage.getItem(DUCK_INTRO_STORAGE_KEY);
    if (!raw) {
      return builtIn;
    }

    const parsed = JSON.parse(raw) as Partial<DuckIntroDefaults>;
    return {
      effectId: isDuckIntroEffectId(parsed.effectId) ? parsed.effectId : builtIn.effectId,
      colorModeId: isDuckIntroColorModeId(parsed.colorModeId)
        ? parsed.colorModeId
        : builtIn.colorModeId,
      durationS: clampDuckIntroDuration(
        typeof parsed.durationS === 'number' ? parsed.durationS : builtIn.durationS,
      ),
      popDurationMs: clampPopDurationMs(
        typeof parsed.popDurationMs === 'number' ? parsed.popDurationMs : builtIn.popDurationMs,
      ),
      popScaleFrom: clampPopScaleFrom(
        typeof parsed.popScaleFrom === 'number' ? parsed.popScaleFrom : builtIn.popScaleFrom,
      ),
      popTranslateY: clampPopTranslateY(
        typeof parsed.popTranslateY === 'number' ? parsed.popTranslateY : builtIn.popTranslateY,
      ),
      popOpacityFrom: clampPopOpacityFrom(
        typeof parsed.popOpacityFrom === 'number' ? parsed.popOpacityFrom : builtIn.popOpacityFrom,
      ),
      popEaseId: isDuckIntroEaseId(parsed.popEaseId) ? parsed.popEaseId : builtIn.popEaseId,
      ditherDriftY: clampDitherDriftY(
        typeof parsed.ditherDriftY === 'number' ? parsed.ditherDriftY : builtIn.ditherDriftY,
      ),
      ditherDriftEaseId: isDuckIntroEaseId(parsed.ditherDriftEaseId)
        ? parsed.ditherDriftEaseId
        : builtIn.ditherDriftEaseId,
    };
  } catch {
    return builtIn;
  }
}

export function writeDuckIntroDefaults(defaults: DuckIntroDefaults): void {
  if (typeof window === 'undefined') {
    return;
  }

  const next: DuckIntroDefaults = {
    effectId: isDuckIntroEffectId(defaults.effectId)
      ? defaults.effectId
      : DUCK_INTRO_DEFAULT_EFFECT,
    colorModeId: isDuckIntroColorModeId(defaults.colorModeId)
      ? defaults.colorModeId
      : DUCK_INTRO_DEFAULT_COLOR_MODE,
    durationS: clampDuckIntroDuration(defaults.durationS),
    popDurationMs: clampPopDurationMs(defaults.popDurationMs),
    popScaleFrom: clampPopScaleFrom(defaults.popScaleFrom),
    popTranslateY: clampPopTranslateY(defaults.popTranslateY),
    popOpacityFrom: clampPopOpacityFrom(defaults.popOpacityFrom),
    popEaseId: isDuckIntroEaseId(defaults.popEaseId) ? defaults.popEaseId : DUCK_INTRO_DEFAULT_POP_EASE,
    ditherDriftY: clampDitherDriftY(defaults.ditherDriftY),
    ditherDriftEaseId: isDuckIntroEaseId(defaults.ditherDriftEaseId)
      ? defaults.ditherDriftEaseId
      : DUCK_INTRO_DEFAULT_DITHER_DRIFT_EASE,
  };

  localStorage.setItem(DUCK_INTRO_STORAGE_KEY, JSON.stringify(next));
}
