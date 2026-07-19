import type { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/src/utils/cn';

export const metadata: Metadata = {
  title: 'Page not found',
};

const homeLinkClassName = cn(
  'type-navigation-sm inline-flex items-center justify-center py-2 px-5 rounded-md',
  'bg-surface-dark-2 text-text-inverted-1',
  'hover:bg-text-subtle focus-visible:bg-text-subtle transition-colors duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
);

export default function NotFound() {
  return (
    <div data-not-found className="bg-background">
      <section
        className="pt-12 md:pt-20 pb-5"
        aria-labelledby="not-found-heading"
      >
        <div className="w-full max-w-xl rounded-lg bg-surface-1 p-[15px] md:p-8">
          <p className="type-label mb-3 text-text-muted">404</p>
          <h1
            id="not-found-heading"
            className="type-title mb-3 text-text"
          >
            this page got lost in the kitchen
          </h1>
          <p className="type-paragraph mb-8 text-text-subtle">
            The link may be broken, or the page may have moved. Either way, there is nothing to
            munch on here.
          </p>
          <Link href="/" className={homeLinkClassName}>
            Back home
          </Link>
        </div>
      </section>
    </div>
  );
}
