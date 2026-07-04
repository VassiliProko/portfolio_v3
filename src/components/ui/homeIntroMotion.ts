/** Shared enter motion for home intro secondary content (subtitle + highlight reel) */
export const HOME_INTRO_SECONDARY_ENTER_DURATION_S = 2.4;
export const HOME_INTRO_SECONDARY_ENTER_EASE = [0, 0.9, 0.1, 1] as const;
/** Start subtitle + highlight reel before BlurText wave fully finishes */
export const HOME_INTRO_SECONDARY_ENTER_EARLY_MS = 500;

export const HOME_INTRO_SUBTITLE_ENTER_OFFSET_PX = 28;

/** RevisionDojo subtitle pill — shared with showcase cool-idea CTA */
export const HOME_INTRO_SUBTITLE_PILL_CLASS =
  'inline-flex rounded-full bg-intro-highlight-rest px-xs py-4xs transition-colors duration-[180ms] ease-move hover:bg-surface-2 hover:text-text motion-reduce:transition-none';

export const HOME_INTRO_SUBTITLE_LINK_FOCUS_CLASS =
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline';

/** Highlight reel enter motion */
export const HOME_INTRO_HIGHLIGHT_REEL_ENTER_DURATION_S = 2.6;
export const HOME_INTRO_HIGHLIGHT_REEL_ENTER_EASE = [0, 0.9, 0.1, 1] as const;
export const HOME_INTRO_HIGHLIGHT_REEL_ENTER_OFFSET_PX = 360;
export const HOME_INTRO_HIGHLIGHT_REEL_ENTER_SCALE_X = 1.04;
export const HOME_INTRO_HIGHLIGHT_REEL_ENTER_BLUR_PX = 4;
