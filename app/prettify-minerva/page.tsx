import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { CaseStudyImage } from '@/src/components/ui/CaseStudyImage';
import { CompareImage } from '@/src/components/ui/CompareImage';
import { PrettifyMinervaLogoLockup } from '@/src/components/ui/PrettifyMinervaLogoLockup';

export const metadata: Metadata = {
  title: 'Prettify Minerva',
  description:
    "Improving the appearance of Minerva, McGill's central university portal.",
};

const PRETTIFY_MINERVA_OVERVIEW = (
  <p>
    Minerva is McGill University’s central information system, known for its outdated interface. To fix this, I redesigned the UI in Figma and turned the concept into a JavaScript browser extension that applies custom styling to the live site. What started as a Reddit post now lives on the Chrome Web Store with over 200 active users.
  </p>
);

export default function PrettifyMinervaCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="Prettify Minerva"
      heroImageSrc="/images/optimized/prettify-minerva/prettify-minerva-head.jpg"
      heroImageAlt="Prettify Minerva preview"
      overview={PRETTIFY_MINERVA_OVERVIEW}
      meta={{
        role: 'Designer / Developer',
        tools: 'Figma, Javascript, ChatGPT',
        skills: 'UI design, Browser Extension development',
      }}
      websiteUrl="https://chromewebstore.google.com/detail/gligldkmadhkgfbomifkomimankgljji?utm_source=item-share-cb"
      websiteLabel="Chrome Web Store"
      githubUrl="https://github.com/VassiliProko/prettify_minerva"
      githubLabel="Github"
    >
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-mock.webp"
        alt="Prettify Minerva case study — overview"
      />
      <CompareImage
        beforeSrc="/images/optimized/prettify-minerva/prettify-minerva-before.jpg"
        afterSrc="/images/optimized/prettify-minerva/prettify-minerva-after.jpg"
        beforeAlt="Minerva before Prettify extension"
        afterAlt="Minerva after Prettify extension"
      />
      <PrettifyMinervaLogoLockup />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-problem.webp"
        alt="The Problem"
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-goal.webp"
        alt="The Goal"
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-initial.webp"
        alt="Initial Design"
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-community.webp"
        alt="Community Feedback"
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-vscode.webp"
        alt="VSCode Extension"
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-solution.webp"
        alt="The Solution"
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-quicklinks.webp"
        alt="Quick Links"
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-result.webp"
        alt="The Result"
      />
    </CaseStudyLayout>
  );
}
