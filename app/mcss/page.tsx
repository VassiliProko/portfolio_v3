import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { CaseStudyImage } from '@/src/components/ui/CaseStudyImage';

export const metadata: Metadata = {
  title: "McGill Chinese Students' Society",
  description:
    "I revamped the MCSS website with a cleaner layout and improved mobile navigation, making it easier for students to discover events, sponsors, and society events.",
};

const MCSS_OVERVIEW = (
  <>
    <p>
    I revamped the MCSS website with a cleaner layout and improved mobile navigation, making it easier for students to discover events, sponsors, and society events.
    </p>
    {/* Add more overview content as needed */}
  </>
);

export default function MCSSCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="McGill Chinese Students' Society"
      heroImageSrc="/images/optimized/mcss/mcss-head.webp"
      heroImageAlt="MCSS website preview"
      overview={MCSS_OVERVIEW}
      meta={{
        time: 'Jun – July 2025',
        role: 'Web Developer',
        tools: 'Figma, Vue.js, Cloudinary, Netlify',
        skills: 'Web design, Frontend development',
      }}
      websiteUrl="https://mcss.ca/"
      githubUrl="https://github.com/Dev-MCSS/mcss-website"
      backHref="/#work"
    >

      <CaseStudyImage
        src="/images/optimized/mcss/mcss-case-3d.webp"
        alt="MCSS case study — overview 3d"
      />
      <CaseStudyImage
        src="/images/optimized/mcss/mcss-case-events.webp"
        alt="MCSS case study — events section"
      />
      <CaseStudyImage
        src="/images/optimized/mcss/mcss-case-sponsors.webp"
        alt="MCSS case study — sponsors section"
      />
    </CaseStudyLayout>

    
  );
}
