import type { Metadata } from 'next';
import { NotFoundHeading } from '@/src/components/ui/NotFoundHeading';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <section
      data-not-found
      className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center"
      aria-labelledby="not-found-heading"
    >
      <NotFoundHeading />
      <p className="type-subtitle text-text-subtle">page not found</p>
    </section>
  );
}
