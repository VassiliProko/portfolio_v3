import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { CASE_STUDY_OVERVIEW_COLUMNS_CLASS } from '@/src/constants/caseStudy';
import { BackgroundSafeVideo } from '@/src/components/ui/BackgroundSafeVideo';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import { CaseStudyImage } from '@/src/components/ui/CaseStudyImage';
import { McssMobileCarousel } from '@/src/components/ui/McssMobileCarousel';
import { McssPhaseSection } from '@/src/components/ui/McssPhaseSection';
import { JsonLd } from '@/src/components/JsonLd';

const mcssJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'McGill Chinese Students’ Society Website Redesign',
  url: 'https://www.vassiliprokopenko.com/mcss',
  description:
    'Website redesign and frontend development for the McGill Chinese Students’ Society, improving navigation, mobile usability, and visual identity.',
  author: { '@id': 'https://www.vassiliprokopenko.com/#person' },
  mainEntityOfPage: 'https://www.vassiliprokopenko.com/mcss',
};

export const metadata: Metadata = {
  title: "McGill Chinese Students' Society",
  description:
    "I revamped the MCSS website with a cleaner layout and improved mobile navigation, making it easier for students to discover events, sponsors, and society events.",
  alternates: {
    canonical: '/mcss',
  },
};

const MCSS_OVERVIEW = (
  <p>
    I revamped the MCSS website with a cleaner layout and improved mobile navigation, making it
    easier for students to discover events, sponsors, and society events. I also brought in a more
    vibrant visual language that better reflects the society’s cultural energy.
  </p>
);

const PHASE_BG_START =
  'linear-gradient(to bottom, var(--color-background), var(--color-surface-2))';
const PHASE_BG_STRUCTURAL =
  'linear-gradient(to top, var(--color-background), var(--color-surface-2))';
const PHASE_BG_RENEWAL =
  'linear-gradient(to bottom, var(--color-surface-dark-1), var(--color-surface-dark-4), var(--color-surface-dark-3))';

export default function MCSSCaseStudyPage() {
  return (
    <>
      <JsonLd data={mcssJsonLd} />
      <CaseStudyLayout
        title="McGill Chinese Students' Society"
        heroImageSrc="/images/optimized/mcss/mcss-head.jpg"
        heroImageAlt="MCSS website header preview"
        heroImageWidth={2752}
        heroImageHeight={1414}
        overview={MCSS_OVERVIEW}
        meta={{
          role: 'Web Developer',
          tools: 'Figma, Next.JS, Cloudinary, Vercel, Cursor',
          duration: '2024-present',
          skills: 'Web design, Frontend development',
        }}
        websiteUrl="https://mcss.ca/"
        websiteLabel="Website"
        githubUrl="https://github.com/Dev-MCSS/websitev2"
        githubLabel="Github"
      >
      <section
        className="w-full overflow-hidden rounded-[8px] bg-surface-2 p-3 md:p-5"
        style={{ background: 'var(--gradient-mcss)' }}
        aria-label="MCSS website preview video"
      >
        <div className="w-full overflow-hidden rounded-lg">
          <BackgroundSafeVideo
            className="pointer-events-none block h-auto w-full"
            src="/other/mcss_video.webm"
            loop
            aria-label="MCSS website preview video"
          />
        </div>
      </section>
      <CaseStudyImage
        src="/images/optimized/mcss/mcss_home_page_desktop.png"
        alt="MCSS homepage desktop preview"
        width={2184}
        height={1370}
        captionLabel="Background"
        captionClassName={`${CASE_STUDY_OVERVIEW_COLUMNS_CLASS} [&_p+_p]:mt-4`}
        caption={
          <>
            <p>
              McGill Chinese Students&apos; Society (MCSS) is the largest and most influential
              cultural student organization in Eastern Canada. We strive to enrich student life at
              McGill by creating meaningful experiences that celebrate Chinese heritage, foster
              personal and academic growth, and build lasting friendships.
            </p>
            <p>
              While Instagram handles most event announcements and daily traction for the society,
              the mcss.ca website serves as a more lasting space for showcasing past events,
              highlighting sponsors, and giving students a better sense of the community and
              society. A website redesign was warranted to make MCSS’s online presence clearer,
              more accessible, and more reflective of the society’s identity + aura.
            </p>
          </>
        }
      />
      <McssMobileCarousel />
      <McssPhaseSection
        title="The Starting Point"
        imageSrc="/images/optimized/mcss/mcss_2024.webp"
        imageAlt="MCSS 2024 website phase"
        imageWidth={758}
        imageHeight={1489}
        mediaBackground={PHASE_BG_START}
        body={
          <p>
            The original website in 2024 lacked visual hierarchy and mobile responsiveness making
            it difficult for visitors to understand the purpose of the site or take any action.
          </p>
        }
      />
      <McssPhaseSection
        title="Structural Refresh"
        imageSrc="/images/optimized/mcss/mcss_2025.webp"
        imageAlt="MCSS 2025 website phase"
        imageWidth={724}
        imageHeight={1214}
        mediaBackground={PHASE_BG_STRUCTURAL}
        captionClassName="[&_p+_p]:mt-4"
        body={
          <>
            <p>
              In 2025, I led a redesign of the website to fix key UX flaws, making the website more
              accessible and cleaner to navigate.
            </p>
            <p>Yet, something still felt missing...</p>
          </>
        }
      />
      <McssPhaseSection
        title="Visual Renewal"
        imageSrc="/images/optimized/mcss/mobile_home.png"
        imageAlt="MCSS visual renewal mobile homepage preview"
        imageWidth={1179}
        imageHeight={2556}
        mediaBackground={PHASE_BG_RENEWAL}
        mediaFrameClassName="mcss-phase-image-glow"
        body={
          <p>
            In 2026, I refined the site’s visual language to better reflect MCSS’s energy and
            identity. Building on the stronger structure from 2025, I introduced a more vibrant
            palette, cleaner composition, and more intentional use of imagery to make the
            experience feel alive, welcoming, and representative of the community.
          </p>
        }
      />
      <CaseStudyImage
        src="/images/optimized/mcss/mcss_figma.webp"
        alt="MCSS Figma design exploration"
        width={1848}
        height={1574}
        captionLabel="Capturing Culture and Vibes"
        captionClassName={CASE_STUDY_OVERVIEW_COLUMNS_CLASS}
        caption={
          <p>
            I explored visual directions that felt energetic, welcoming, and true to MCSS’s
            cultural identity. Using Pinterest moodboards as a starting point, I filtered ideas by
            how well they balanced personality, clarity, and mobile readability. This helped shape
            a more vibrant and cohesive design language that supported both the society’s brand and
            the site’s usability.
          </p>
        }
      />
      <CaseStudyImage
        src="/images/optimized/mcss/mcss_mockup.webp"
        alt="MCSS implementation mockup preview"
        width={1920}
        height={2208}
        captionLabel="Implementation"
        captionClassName={CASE_STUDY_OVERVIEW_COLUMNS_CLASS}
        caption={
          <>
            <p>
              The site is built with Next.js as the core framework, with Cloudinary serving as the
              digital asset management layer for image storage and optimization. I used Cursor
              heavily throughout development to move faster through implementation, iteration, and
              debugging, and deployed the final site on Vercel for reliable hosting and smooth
              delivery.
            </p>
            <p>
              Together, these tools allowed me to build a site that was fast, maintainable, and
              easy to update for future MCSS content.
            </p>
          </>
        }
      />
      <figure className="flex w-full flex-col">
        <CaseStudyCaption
          captionLabel="Results"
          captionClassName={CASE_STUDY_OVERVIEW_COLUMNS_CLASS}
          caption={
            <p>
              The redesign improved the site’s overall usability by simplifying page structure,
              strengthening visual hierarchy, and making the experience fully responsive across
              devices. With over 500 monthly visitors, the site now gives its audience a clearer
              and more performant experience, meeting Google PageSpeed best practices for speed and
              accessibility.
            </p>
          }
        />
      </figure>
      </CaseStudyLayout>
    </>
  );
}
