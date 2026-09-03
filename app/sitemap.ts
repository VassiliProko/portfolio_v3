import type { MetadataRoute } from 'next';
import { getLastUpdatedIso } from '@/src/utils/get-last-updated-iso';

const SITE_URL = 'https://www.vassiliprokopenko.com';
const LAST_MODIFIED = getLastUpdatedIso();

const PAGES = [
  { path: '', priority: 1, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/prettify-minerva', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/dojo-icons', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/jetpacks', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/usthing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/mcss', priority: 0.8, changeFrequency: 'monthly' },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
