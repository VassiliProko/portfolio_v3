const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const LAST_UPDATED_ISO = process.env.NEXT_PUBLIC_LAST_UPDATED ?? '';

export function formatLastUpdated(isoDate: string): string {
  if (!isoDate) return 'Last Updated: —';

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Last Updated: —';

  return `Last Updated: ${MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}
