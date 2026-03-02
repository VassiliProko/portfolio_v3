import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { CaseStudyImage } from '@/src/components/ui/CaseStudyImage';
import { CompareImage } from '@/src/components/ui/CompareImage';

export const metadata: Metadata = {
  title: 'Prettify Minerva',
  description:
    "Improving the appearance of Minerva, McGill's central university portal.",
};

const PRETTIFY_MINERVA_OVERVIEW = (
  <>
    <p>
    I improved the appearance of Minerva, McGill's central university portal, with a javascript browser extension. After being frustrated with Minerva’s outdated interface and hearing similar complaints from other students, I decided to see if I could reshape the platform. I initially made a Figma dashboard concept that I shared on Reddit which received a comment on how a browser extension solution may be viable. I took this idea and went on to build a browser extension which applies custom styling and layout improvements directly to the live Minerva site. Currently the extension is published on the chrome web store and has over 200 active users.
    </p>
  </>
);

export default function PrettifyMinervaCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="Prettify Minerva"
      heroImageSrc="/images/optimized/prettify-minerva/prettify-minerva-head.webp"
      heroImageAlt="Prettify Minerva preview"
      overview={PRETTIFY_MINERVA_OVERVIEW}
      meta={{
        time: 'Q2 2025',
        role: 'Designer / Developer',
        tools: 'Figma, Javascript',
        skills: 'UI design, Browser Extension development',
      }}
      websiteUrl="https://chromewebstore.google.com/detail/gligldkmadhkgfbomifkomimankgljji?utm_source=item-share-cb"
      websiteLabel="view chrome web store"
      githubUrl="https://github.com/VassiliProko/prettify_minerva"
      backHref="/#work"
      
    >

      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-mock.webp"
        alt="Prettify Minerva case study — overview"
      />
      <CompareImage
        beforeSrc="/images/optimized/prettify-minerva/prettify-minerva-before.webp"
        afterSrc="/images/optimized/prettify-minerva/prettify-minerva-after.webp"
        beforeAlt="Minerva before Prettify extension"
        afterAlt="Minerva after Prettify extension"
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-logo.webp"
        alt="Prettify Minerva case study — logo"
      />
    </CaseStudyLayout>
  );
}
