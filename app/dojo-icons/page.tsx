import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { BackgroundSafeVideo } from '@/src/components/ui/BackgroundSafeVideo';
import { CaseStudyImage } from '@/src/components/ui/CaseStudyImage';
import { DojoIconVariantStrip } from '@/src/components/ui/DojoIconVariantStrip';
import { JsonLd } from '@/src/components/JsonLd';

const dojoIconsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'RevisionDojo Icons',
  url: 'https://www.vassiliprokopenko.com/dojo-icons',
  description:
    'Icon system redesign for RevisionDojo, the IB learning platform used by more than 650,000 students.',
  author: { '@id': 'https://www.vassiliprokopenko.com/#person' },
  mainEntityOfPage: 'https://www.vassiliprokopenko.com/dojo-icons',
};

export const metadata: Metadata = {
  title: 'RevisionDojo Icons',
  description:
    'Icon system revamp for RevisionDojo, the world\'s largest IB platform used by 650k+ students.',
  alternates: {
    canonical: '/dojo-icons',
  },
};

const DOJO_ICONS_OVERVIEW = (
  <p>
    During my internship at General Learning (YC F24), I revamped icons for RevisionDojo, the
    world&apos;s largest IB platform used by 650k+ students. I helped craft 20+ hand-drawn icons with
    4 color variantions each to represent core platform features.
  </p>
);

export default function DojoIconsCaseStudyPage() {
  return (
    <>
      <JsonLd data={dojoIconsJsonLd} />
      <CaseStudyLayout
        title="RevisionDojo Icons"
        heroImageSrc="/images/optimized/dojo-icons/dojo-icons-head.jpg"
        heroImageAlt="RevisionDojo icon collection"
        heroImageWidth={2752}
        heroImageHeight={1414}
        overview={DOJO_ICONS_OVERVIEW}
        meta={{
          role: 'Designer',
          tools: 'Figma',
          skills: 'Visual design',
        }}
        websiteUrl="https://www.revisiondojo.com/"
        websiteLabel="RevisionDojo"
      >
      <figure className="m-0 flex w-full flex-col gap-2xs">
        <div className="w-full overflow-hidden rounded-[8px]">
          <BackgroundSafeVideo
            className="pointer-events-none block h-auto w-full"
            sources={[
              { src: '/other/dojo-icons-preview-new.webm', type: 'video/webm' },
              { src: '/other/dojo-icons-preview-new.mp4', type: 'video/mp4' },
            ]}
            loop
            aria-label="RevisionDojo icons preview animation"
          />
        </div>
        <figcaption className="type-paragraph m-0 text-text-subtle">
          Icon preview animation made with Cursor
        </figcaption>
      </figure>

      <DojoIconVariantStrip />

      <CaseStudyImage
        src="/images/optimized/dojo-icons/dojo-compsci-icons.png"
        alt="RevisionDojo Computer Science icons preview"
        width={1792}
        height={1458}
      />
      </CaseStudyLayout>
    </>
  );
}
