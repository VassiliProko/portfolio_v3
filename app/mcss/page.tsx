import type { Metadata } from 'next';
import Image from 'next/image';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { McssMobileCarousel } from '@/src/components/ui/McssMobileCarousel';

export const metadata: Metadata = {
  title: "McGill Chinese Students' Society",
  description:
    "I revamped the MCSS website with a cleaner layout and improved mobile navigation, making it easier for students to discover events, sponsors, and society events.",
};

const MCSS_OVERVIEW = (
  <>
    <p>
    I revamped the MCSS website with a cleaner layout and improved mobile navigation, making it easier for students to discover events, sponsors, and society events. I also brought in a more vibrant visual language that better reflects the society’s cultural energy.
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
        time: 'Mar – Apr 2026',
        role: 'Web Developer',
        tools: 'Figma, Next.JS, Cloudinary, Vercel',
        skills: 'Web design, Frontend development',
      }}
      websiteUrl="https://mcss.ca/"
      githubUrl="https://github.com/Dev-MCSS/websitev2"
      backHref="/#work"
    >
      <section className="w-full rounded-[8px] bg-gradient-to-b from-background to-surface-2 p-3 md:p-5">
        <div className="overflow-hidden rounded-[8px]">
          <Image
            src="/images/optimized/mcss/mcss_home_page_desktop.png"
            alt="MCSS homepage desktop preview"
            width={1920}
            height={1080}
            className="h-auto w-full object-cover"
            priority={false}
          />
        </div>
      </section>
      <McssMobileCarousel />
    </CaseStudyLayout>
  );
}
