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

const MCSS_BACKGROUND_INTRO =
  "McGill Chinese Students' Society (MCSS) is the largest and most influential cultural student organization in Eastern Canada. We strive to enrich student life at McGill by creating meaningful experiences that celebrate Chinese heritage, foster personal and academic growth, and build lasting friendships.";

const MCSS_BACKGROUND =
  "While Instagram handles most event announcements and daily traction for the society, the mcss.ca website serves as a more lasting space for showcasing past events, highlighting sponsors, and giving students a better sense of the community and society. A website redesign was warranted to make MCSS’s online presence clearer, more accessible, and more reflective of the society’s identity + aura.";

const MCSS_CULTURE_AND_VIBES =
  "I explored visual directions that felt energetic, welcoming, and true to MCSS’s cultural identity. Using Pinterest moodboards as a starting point, I filtered ideas by how well they balanced personality, clarity, and mobile readability. This helped shape a more vibrant and cohesive design language that supported both the society’s brand and the site’s usability.";

const MCSS_IMPLEMENTATION_PRIMARY =
  "The site is built with Next.js as the core framework, with Cloudinary serving as the digital asset management layer for image storage and optimization. I used Cursor heavily throughout development to move faster through implementation, iteration, and debugging, and deployed the final site on Vercel for reliable hosting and smooth delivery.";

const MCSS_IMPLEMENTATION_SECONDARY =
  "Together, these tools allowed me to build a site that was fast, maintainable, and easy to update for future MCSS content.";

const MCSS_RESULTS =
  "The redesign improved the site’s overall usability by simplifying page structure, strengthening visual hierarchy, and making the experience fully responsive across devices. With over 500 monthly visitors, the site now gives its audience a clearer and more performant experience, while also meeting Google PageSpeed best practices for speed and accessibility.";

const MCSS_BACKGROUND_PHASES = [
  {
    title: 'The Starting Point',
    body: 'The original website in 2024 lacked visual hierarchy and mobile responsiveness making it difficult for visitors to understand the purpose of the site or take any action.',
    imageSrc: '/images/optimized/mcss/mcss_2024.webp',
    imageAlt: 'MCSS 2024 website phase',
  },
  {
    title: 'Structural Refresh',
    body: 'In 2025, I led a redesign of the website to fix key UX flaws, making the website more accessible and cleaner to navigate.',
    imageSrc: '/images/optimized/mcss/mcss_2025.webp',
    imageAlt: 'MCSS 2025 website phase',
  },
  {
    title: 'Visual Renewal',
    body: 'In 2026, I refined the site’s visual language to better reflect MCSS’s energy and identity. Building on the stronger structure from 2025, I introduced a more vibrant palette, cleaner composition, and more intentional use of imagery to make the experience feel alive, welcoming, and representative of the community.',
    imageSrc: '/images/optimized/mcss/mobile_home.png',
    imageAlt: 'MCSS visual renewal mobile homepage preview',
  },
] as const;

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
      <section
        className="w-full py-8 md:py-12 font-sans text-md md:text-lg leading-relaxed"
        aria-labelledby="background-heading"
      >
        <h2 id="background-heading" className="mb-4 text-xl md:text-2xl font-bold text-text">
          Background
        </h2>
        <div className="md:max-w-[65%]">
          <p className="mb-4 text-text-subtle">{MCSS_BACKGROUND_INTRO}</p>
          <p className="text-text-subtle">{MCSS_BACKGROUND}</p>
        </div>
      </section>

      {MCSS_BACKGROUND_PHASES.map((phase, index) => (
        <section
          key={phase.title}
          className={`w-full pt-8 md:pt-12 font-sans text-md md:text-lg leading-relaxed ${
            index === 2 ? 'pb-4 md:pb-6' : 'pb-8 md:pb-12'
          }`}
          aria-labelledby={`${phase.title.toLowerCase().replace(/\s+/g, '-')}-heading`}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div>
              <h3
                id={`${phase.title.toLowerCase().replace(/\s+/g, '-')}-heading`}
                className="mb-3 text-lg md:text-xl font-semibold text-text"
              >
                {phase.title}
              </h3>
              <p className="text-text-subtle">{phase.body}</p>
              {phase.title === 'Structural Refresh' ? (
                <p className="mt-4 text-text-subtle">Yet, something still felt missing...</p>
              ) : null}
            </div>
            <div className="flex justify-center py-8 md:py-10">
              <div
                className={`w-full rounded-[8px] px-5 py-10 md:px-8 md:py-12 ${
                  index === 1
                    ? 'bg-gradient-to-t from-background to-surface-2'
                    : index === 2
                      ? 'bg-gradient-to-b from-surface-dark-1 via-surface-dark-4 to-surface-dark-3'
                    : 'bg-gradient-to-b from-background to-surface-2'
                }`}
              >
                <div
                  className={`mx-auto w-full max-w-[300px] overflow-hidden rounded-[8px] border border-border-base bg-surface-1 ${
                    index === 2 ? 'mcss-phase-image-glow' : ''
                  }`}
                >
                  {phase.imageSrc ? (
                    <Image
                      src={phase.imageSrc}
                      alt={phase.imageAlt}
                      width={1200}
                      height={900}
                      className="h-auto w-full object-cover"
                    />
                  ) : (
                    <div className="flex min-h-[200px] items-center justify-center p-5 text-center text-text-muted">
                      Image placeholder
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="w-full rounded-[8px] bg-surface-dark-2 p-3 md:p-5">
        <div className="overflow-hidden rounded-[8px]">
          <Image
            src="/images/optimized/mcss/mcss_figma.webp"
            alt="MCSS Figma design exploration"
            width={1920}
            height={1080}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="w-full py-8 md:py-12 font-sans text-md md:text-lg leading-relaxed">
        <h2 className="mb-4 text-xl md:text-2xl font-bold text-text">Capturing Culture and Vibes</h2>
        <p className="md:max-w-[65%] text-text-subtle">{MCSS_CULTURE_AND_VIBES}</p>
      </section>

      <section className="w-full py-8 md:py-12 font-sans text-md md:text-lg leading-relaxed">
        <h2 className="mb-4 text-xl md:text-2xl font-bold text-text">Implementation</h2>
        <div className="md:max-w-[65%]">
          <p className="text-text-subtle">{MCSS_IMPLEMENTATION_PRIMARY}</p>
          <p className="mt-4 text-text-subtle">{MCSS_IMPLEMENTATION_SECONDARY}</p>
        </div>
      </section>

      <section className="w-full">
        <div className="overflow-hidden rounded-[8px]">
          <Image
            src="/images/optimized/mcss/mcss_mockup.webp"
            alt="MCSS implementation mockup preview"
            width={1920}
            height={1080}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="w-full py-8 md:py-12 font-sans text-md md:text-lg leading-relaxed">
        <h2 className="mb-4 text-xl md:text-2xl font-bold text-text">Results</h2>
        <p className="md:max-w-[65%] text-text-subtle">{MCSS_RESULTS}</p>
      </section>
    </CaseStudyLayout>
  );
}
