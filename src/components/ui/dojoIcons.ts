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

export const LIGHT_SET = buildIconSet('light', false);
export const DARK_SET = buildIconSet('dark', false);
export const LIGHT_TINTED = buildIconSet('light', true);
export const DARK_TINTED = buildIconSet('dark', true);

/** Deterministic shuffle so count changes feel stable until shuffle is pressed. */
export function pickIcons(pool: DojoIconRef[], count: number, seed: number): DojoIconRef[] {
  const list = [...pool];
  let s = seed || 1;
  for (let i = list.length - 1; i > 0; i -= 1) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, Math.min(count, list.length));
}

export function mixedPool(): DojoIconRef[] {
  const out: DojoIconRef[] = [];
  DOJO_ICON_NAMES.forEach((name, index) => {
    const lane = index % 5;
    if (lane === 0 || lane === 1) out.push({ name, mode: 'light' });
    else if (lane === 2) out.push({ name, mode: 'light', tinted: true });
    else out.push({ name, mode: 'dark' });
  });
  return out;
}
