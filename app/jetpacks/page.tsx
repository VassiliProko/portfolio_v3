import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { JetpacksLoadingAnimation } from '@/src/components/ui/JetpacksLoadingAnimation';
import { JetpacksLogoBoard } from '@/src/components/ui/JetpacksLogoBoard';
import { JetpacksCastBoard, JetpacksHomeBoard } from '@/src/components/ui/JetpacksMascotSections';
import { JetpacksWavingAnimation } from '@/src/components/ui/JetpacksWavingAnimation';

export const metadata: Metadata = {
  title: 'Jetpacks',
  description:
    'Brand design for Jetpacks, an AI-powered study workspace — including the chicken-with-jetpacks mascot and supporting graphics.',
};

const META_LINK_CLASS =
  'text-inherit no-underline transition-all duration-micro ease-snap hover:underline hover:underline-offset-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-sm';

const JETPACKS_OVERVIEW = (
  <p>
    I led the brand design for Jetpacks, an AI-powered study workspace. I created the
    chicken-with-jetpacks mascot, and supporting graphics + animations that give the product a
    playful, memorable identity.
  </p>
);

const JETPACKS_TEAM = (
  <div className="flex flex-col gap-4xs">
    <span>Designer - Me</span>
    <span>
      Dev -{' '}
      <a
        href="https://www.linkedin.com/in/jasonjonarto/"
        target="_blank"
        rel="noopener noreferrer"
        className={META_LINK_CLASS}
      >
        Jason Jonarto
      </a>
    </span>
  </div>
);

export default function JetpacksCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="Jetpacks"
      heroImageSrc="/images/optimized/jetpacks/jetpacks-head.jpg"
      heroImageAlt="Jetpacks brand showcase"
      heroImageWidth={2752}
      heroImageHeight={1464}
      overview={JETPACKS_OVERVIEW}
      meta={{
        team: JETPACKS_TEAM,
        tools: 'Figma, Rive',
      }}
      websiteUrl="https://jetpacks.com"
      websiteLabel="Jetpacks"
    >
      <JetpacksLogoBoard />
      <JetpacksLoadingAnimation />
      <JetpacksCastBoard />
      <JetpacksWavingAnimation />
      <JetpacksHomeBoard />
    </CaseStudyLayout>
  );
}
