'use client';

import posthog from 'posthog-js';

export type AnalyticsEventName =
  | 'project_viewed'
  | 'resume_clicked'
  | 'linkedin_clicked'
  | 'email_clicked'
  | 'project_demo_clicked'
  | 'case_study_section_reached';

export type AnalyticsProperties = Record<string, string>;

export function trackEvent(
  event: AnalyticsEventName,
  properties?: AnalyticsProperties,
): void {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

export function projectSlugFromPathname(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment ?? 'unknown';
}

export function sectionIdFromLabel(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}
