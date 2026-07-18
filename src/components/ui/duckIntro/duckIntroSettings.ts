export const DUCK_INTRO_GRID = 16;
/** 12px per source pixel → 192px (~5× nav logo) */
export const DUCK_INTRO_CELL_PX = 12;
export const DUCK_INTRO_DISPLAY_PX = DUCK_INTRO_GRID * DUCK_INTRO_CELL_PX;

/** Pop-in */
export const DUCK_INTRO_POP_DURATION_S = 0.28;
export const DUCK_INTRO_POP_SCALE_FROM = 0.6;
export const DUCK_INTRO_POP_TRANSLATE_Y = 0.2;
export const DUCK_INTRO_POP_OPACITY_FROM = 0.53;
export const DUCK_INTRO_POP_EASE = [0.4, 0, 1, 1] as const;

/** Pause after pop before dither */
export const DUCK_INTRO_DITHER_DELAY_MS = 50;

/** Scan-wipe dither + upward drift */
export const DUCK_INTRO_DITHER_DURATION_S = 0.85;
export const DUCK_INTRO_DITHER_DRIFT_Y = 0.08;
export const DUCK_INTRO_DITHER_DRIFT_EASE = [0.22, 1, 0.36, 1] as const;
