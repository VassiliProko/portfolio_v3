export const CASE_STUDY_PATHS = [
  '/prettify-minerva',
  '/dojo-icons',
  '/jetpacks',
] as const;

export function isCaseStudyPath(pathname: string) {
  return CASE_STUDY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
