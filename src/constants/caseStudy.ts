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

/** Caption rhythm — compact for 1–2 lines; section for labels or editorial blocks. */
export type CaseStudyCaptionLayout = 'compact' | 'section';

export const CASE_STUDY_CAPTION_FIGURE_GAP_COMPACT = 'gap-2xs';
export const CASE_STUDY_CAPTION_FIGURE_GAP_SECTION = 'gap-md';
export const CASE_STUDY_CAPTION_FOOTER_CLASS = 'mb-lg md:mb-xl';

export function resolveCaseStudyCaptionLayout({
  captionLabel,
  captionClassName,
  captionLayout,
  hasSectionFooter,
}: {
  captionLabel?: string;
  captionClassName?: string;
  captionLayout?: CaseStudyCaptionLayout;
  /** Chrome Web Store row, etc. — uses section spacing like a label block. */
  hasSectionFooter?: boolean;
}): CaseStudyCaptionLayout {
  if (captionLayout) return captionLayout;
  if (captionLabel || hasSectionFooter) return 'section';
  if (captionClassName?.includes('md:columns-2')) return 'section';
  return 'compact';
}

export function caseStudyCaptionFigureGapClass(
  layout: CaseStudyCaptionLayout
): string {
  return layout === 'section'
    ? CASE_STUDY_CAPTION_FIGURE_GAP_SECTION
    : CASE_STUDY_CAPTION_FIGURE_GAP_COMPACT;
}

/**
 * Single-column body measure (~65 character editorial line).
 * Overview uses CSS `columns` instead — pass a single unbroken `<p>`.
 */
export const CASE_STUDY_BODY_CLASS = 'max-w-[clamp(12rem,40ch,100%)]';

/** Inset media frame: pad left / right / top, flush bottom (CompareImage + CaseStudyImage). */
export const CASE_STUDY_MEDIA_INSET_CLASS = 'px-6 pt-6 md:px-10 md:pt-10';

/** External case-study link row (Chrome Web Store, GitHub, etc.). */
export const CASE_STUDY_EXTERNAL_LINK_CLASS =
  'group inline-flex h-12 w-full items-center justify-between gap-2xs rounded-sm bg-surface-1 px-4 type-label text-text-muted transition-colors duration-micro ease-snap hover:bg-surface-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline';
