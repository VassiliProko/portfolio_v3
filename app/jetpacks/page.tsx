import type { Metadata } from 'next';
import Image from 'next/image';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';

export const metadata: Metadata = {
  title: 'Jetpacks',
  description:
    'Brand design for Jetpacks, an AI study tool — including the chicken-with-jetpacks mascot and supporting graphics.',
};

const JETPACKS_LINK_CLASS =
  'text-text underline underline-offset-2 transition-colors duration-micro ease-snap hover:text-text-muted focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-sm';

const JETPACKS_OVERVIEW = (
  <p>
    Led the brand design for Jetpacks, an AI study tool. Created the chicken-with-jetpacks mascot,
    logo lockup, and supporting graphics that give the product a playful, memorable identity. More
    at{' '}
    <a
      href="https://jetpacks.com"
      target="_blank"
      rel="noopener noreferrer"
      className={JETPACKS_LINK_CLASS}
    >
      jetpacks.com
    </a>
    .
  </p>
);

const JETPACKS_HERO = (
  <section
    className="flex w-full items-center justify-center rounded-[8px] bg-surface-dark-1 px-md py-xl md:px-xl md:py-2xl"
    aria-label="Jetpacks brand logo"
  >
    <Image
      src="/images/optimized/jetpacks/jetpacks-logo.svg"
      alt="Jetpacks logo — chicken mascot with jetpack next to the Jetpacks wordmark"
      width={451}
      height={141}
      className="pointer-events-none h-auto w-full max-w-[520px] select-none object-contain"
      sizes="(max-width: 768px) 90vw, 520px"
      priority={false}
    />
  </section>
);

export default function JetpacksCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="Jetpacks"
      hero={JETPACKS_HERO}
      overview={JETPACKS_OVERVIEW}
      meta={{
        role: 'Brand Designer',
        tools: 'Figma',
        skills: 'Brand Design, Mascot, Graphics',
      }}
      websiteUrl="https://jetpacks.com"
      websiteLabel="Jetpacks"
    />
  );
}
