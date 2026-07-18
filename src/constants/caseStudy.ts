/**
 * Content column below the hero: two editorial measures (~40ch ≈ 65 chars in Satoshi)
 * + column gap + gutter. `min(100%, …)` stays flush on small viewports and caps on
 * desktop — a clamp max of 100% previously always won because 2×65ch exceeded the parent.
 * Gap calc must match CASE_STUDY_OVERVIEW_COLUMNS_CLASS.
 */
export const CASE_STUDY_CONTENT_CLASS =
  'mx-auto w-full max-w-[min(100%,calc(2*40ch+var(--spacing-about-role-icon)+var(--spacing-2xs)))]';

/**
 * Editorial overview: one flowing `<p>`, two CSS columns on md+
 * (gap = Figma gutter + small left-column margin).
 */
export const CASE_STUDY_OVERVIEW_COLUMNS_CLASS =
  'md:columns-2 md:[column-gap:calc(var(--spacing-about-role-icon)+var(--spacing-2xs))]';

/**
 * Single-column body measure (~65 character editorial line).
 * Overview uses CSS `columns` instead — pass a single unbroken `<p>`.
 */
export const CASE_STUDY_BODY_CLASS = 'max-w-[clamp(12rem,40ch,100%)]';
