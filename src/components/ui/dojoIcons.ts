export type IconMode = 'light' | 'dark';

export type DojoIconRef = {
  name: string;
  mode: IconMode;
  tinted?: boolean;
};

export const DOJO_ICON_NAMES = [
  'flashcards',
  'notes',
  'question-bank',
  'lessons',
  'videos',
  'cheatsheets',
  'past-papers',
  'glossary',
  'exercises',
  'exam-builder',
  'teach-jojo',
  'vocab-practice',
  'case-study',
  'guide-IA',
  'essay-marker',
  'grade-boundaries',
  'literary-hub',
  'databook',
  'predicted-papers',
  'exemplars-EE',
  'feedback-EE',
] as const;

export type DojoIconName = (typeof DOJO_ICON_NAMES)[number];

export function iconSrc({ name, mode, tinted = false }: DojoIconRef) {
  return `/images/optimized/dojo-icons/icon-${name}-${mode}${tinted ? '-tinted' : ''}.svg`;
}

export function buildIconSet(
  mode: IconMode,
  tinted: boolean,
  names: readonly string[] = DOJO_ICON_NAMES,
): DojoIconRef[] {
  return names.map((name) => ({ name, mode, tinted }));
}

export const DARK_TINTED = buildIconSet('dark', true);
