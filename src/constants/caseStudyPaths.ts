export const CASE_STUDY_PATHS = ['/mcss', '/prettify-minerva', '/usthing'] as const;

export function isCaseStudyPath(pathname: string) {
  return CASE_STUDY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
