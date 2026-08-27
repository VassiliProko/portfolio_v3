import posthog from 'posthog-js';

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (key) {
  posthog.init(key, {
    api_host: host,
    defaults: '2026-05-30',
    autocapture: false,
    person_profiles: 'identified_only',
  });
}
