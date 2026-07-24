import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { BackgroundSafeVideo } from '@/src/components/ui/BackgroundSafeVideo';
import { CaseStudyImage } from '@/src/components/ui/CaseStudyImage';

export const metadata: Metadata = {
  title: "McGill Chinese Students' Society",
  description:
    "I revamped the MCSS website with a cleaner layout and improved mobile navigation, making it easier for students to discover events, sponsors, and society events.",
};

const MCSS_OVERVIEW = (
  <p>
    McGill Chinese Students’ Society (MCSS) is a university society that hosts local Montreal cultural events to enrich student life. As a designer, I crafted promotional materials and led the revamp of the website to better reflect the society’s energy and improve accessibility. 
  </p>
);

export default function MCSSCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="McGill Chinese Students' Society"
      heroImageSrc="/images/optimized/mcss/mcss-head.jpg"
      heroImageAlt="MCSS website header preview"
      heroImageWidth={2752}
      heroImageHeight={1414}
      overview={MCSS_OVERVIEW}
      meta={{
        role: 'Graphic Designer & Web Developer',
        tools: 'Figma, Procreate, Next.JS, Cloudinary, Vercel, Cursor',
        duration: '2024-present',
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
        src="/images/optimized/mcss/membership-card.webp"
        alt="MCSS joint student society membership card"
        caption="Joint student society membership card offering exclusive restaurant discounts"
        width={2800}
        height={2100}
      />
      <CaseStudyImage
        images={[
          {
            src: '/images/optimized/mcss/mcss-custom-1.jpg',
            alt: 'MCSS limited edition merchandise design 1',
            width: 1584,
            height: 1968,
          },
          {
            src: '/images/optimized/mcss/mcss-custom-2.jpg',
            alt: 'MCSS limited edition merchandise design 2',
            width: 1584,
            height: 1968,
          },
        ]}
        caption="limited edition merchandise"
      />
      <CaseStudyImage
        src="/images/optimized/mcss/mcss_mockup.webp"
        alt="MCSS implementation mockup preview"
        width={1920}
        height={2208}
      />
    </CaseStudyLayout>
  );
}
