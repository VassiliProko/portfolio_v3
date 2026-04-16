import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';

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
      heroVideoEmbedUrl="https://www.youtube.com/embed/WBKNriQ3Jew?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=WBKNriQ3Jew"
      heroVideoTitle="MCSS website preview video"
      heroMediaStyle={{ background: 'var(--gradient-mcss)' }}
      overview={MCSS_OVERVIEW}
      meta={{
        time: 'Jun – July 2025',
        role: 'Web Developer',
        tools: 'Figma, Vue.js, Cloudinary, Netlify',
        skills: 'Web design, Frontend development',
      }}
      websiteUrl="https://mcss.ca/"
      githubUrl="https://github.com/Dev-MCSS/websitev2"
      backHref="/#work"
    />

    
  );
}
