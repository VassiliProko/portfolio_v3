'use client';

import type { PostHog } from 'posthog-js';

let posthogPromise: Promise<PostHog | null> | undefined;

export function initPostHog(): Promise<PostHog | null> {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return Promise.resolve(null);
  }

  posthogPromise ??= import('posthog-js').then(({ default: posthog }) => {
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: '2026-05-30',
        capture_pageview: 'history_change',
        autocapture: false,
        person_profiles: 'identified_only',
        disable_session_recording: false,
        session_recording: { maskAllInputs: true },
        disable_surveys: true,
      });
    }
    return posthog;
  }).catch(() => {
    posthogPromise = undefined;
    return null;
  });
  return posthogPromise;
}

export type AnalyticsEventName =
  | 'project_viewed'
  | 'resume_clicked'
  | 'linkedin_clicked'
  | 'email_clicked'
  | 'project_demo_clicked'
  | 'preview_opened'
  | 'case_study_section_reached';

export type AnalyticsProperties = Record<string, string>;

export function trackEvent(
  event: AnalyticsEventName,
  properties?: AnalyticsProperties,
): void {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  void initPostHog().then((posthog) => posthog?.capture(event, properties));
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
