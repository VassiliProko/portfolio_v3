import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { CASE_STUDY_OVERVIEW_COLUMNS_CLASS } from '@/src/constants/caseStudy';
import { CaseStudyImage } from '@/src/components/ui/CaseStudyImage';
import { CompareImage } from '@/src/components/ui/CompareImage';
import { PrettifyMinervaLogoLockup } from '@/src/components/ui/PrettifyMinervaLogoLockup';
import { PrettifyMinervaRedditComment } from '@/src/components/ui/PrettifyMinervaRedditComment';

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
        src="/images/optimized/prettify-minerva/minerva-wayback-machine.png"
        alt="Archived Minerva login page via the Wayback Machine"
        width={2880}
        height={1314}
        mediaBar
        captionLabel="The Problem"
        captionClassName={CASE_STUDY_OVERVIEW_COLUMNS_CLASS}
        caption={
          <>
            <p>
              According to the Wayback Machine, Minerva has remained largely unchanged since
              the 2010s. Through my own experience using the platform and conversations with
              classmates, I saw an opportunity to reimagine Minerva. The goal was to redesign Minerva to enhance its clarity, usability, and visual
              appeal. The original interface displays dense information with limited spacing,
              small typography, and a cluttered layout, creating cognitive overload and
              hindering navigation, particularly for new users.
            </p>
          </>
        }
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-initial.webp"
        alt="Initial Minerva redesign concept with sidebar navigation"
        width={2320}
        height={1274}
        captionLabel="Community Response"
        captionClassName={CASE_STUDY_OVERVIEW_COLUMNS_CLASS}
        caption={
          <p>
            I shared this concept of Minerva on the McGill subreddit which garnered over{' '}
            <strong className="text-text">70k impressions</strong> with{' '}
            <strong className="text-text">positive engagement</strong>. This dashboard style design
            was inspired from other McGill sites like MyCourses, McGill’s learning management
            system.
          </p>
        }
      />
      <PrettifyMinervaRedditComment
        quote="“Could this be developed into a Chrome extension? This is a million times better than the current interface.”"
        subtitle="A highly upvoted comment suggesting a potential browser extension solution sparked further exploration and curiosity..."
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-vscode.jpg"
        alt="VSCode Extension"
        width={2184}
        height={1207}
        mediaInset
        mediaBackground="var(--gradient-prettify-minerva-vscode)"
        captionLabel="Browser Extension Solution"
        captionClassName={CASE_STUDY_OVERVIEW_COLUMNS_CLASS}
        caption={
          <p>
            Using JavaScript to directly manipulate page content and HTML structure. I also
            injected custom CSS to restyle Minerva’s interface, making the site cleaner and more
            visually appealing.
          </p>
        }
      />
      <CaseStudyImage
        src="/images/optimized/prettify-minerva/prettify-minerva-solution.webp"
        alt="Browser extension before and after comparison"
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
