import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { CASE_STUDY_OVERVIEW_COLUMNS_CLASS } from '@/src/constants/caseStudy';
import { JetpacksBrandFamilyBoard } from '@/src/components/ui/JetpacksBrandFamilyBoard';
import { JetpacksLoadingAnimation } from '@/src/components/ui/JetpacksLoadingAnimation';
import { JetpacksLogoBoard } from '@/src/components/ui/JetpacksLogoBoard';
import { JetpacksCastBoard, JetpacksHomeBoard } from '@/src/components/ui/JetpacksMascotSections';
import { JetpacksSilhouetteBoard } from '@/src/components/ui/JetpacksSilhouetteBoard';
import { JetpacksWavingAnimation } from '@/src/components/ui/JetpacksWavingAnimation';

export const metadata: Metadata = {
  title: 'Jetpacks',
  description:
    'Brand design for Jetpacks, an AI-powered study workspace — including the chicken-with-jetpacks mascot and supporting graphics.',
};

const META_LINK_CLASS =
  'text-inherit no-underline transition-all duration-micro ease-snap hover:underline hover:underline-offset-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-sm';

const JETPACKS_OVERVIEW = (
  <p>
    I led the brand design for Jetpacks, an AI-powered study workspace. I created the
    chicken-with-jetpacks mascot, and supporting graphics + animations to give the product a
    playful, memorable identity.
  </p>
);

const JETPACKS_TEAM = (
  <div className="flex flex-col gap-4xs">
    <span>Designer - Me</span>
    <span>
      Dev -{' '}
      <a
        href="https://www.linkedin.com/in/jasonjonarto/"
        target="_blank"
        rel="noopener noreferrer"
        className={META_LINK_CLASS}
      >
        Jason Jonarto
      </a>
    </span>
  </div>
);

export default function JetpacksCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="Jetpacks"
      heroImageSrc="/images/optimized/jetpacks/jetpacks-head.jpg"
      heroImageAlt="Jetpacks brand showcase"
      heroImageWidth={2752}
      heroImageHeight={1464}
      overview={JETPACKS_OVERVIEW}
      meta={{
        team: JETPACKS_TEAM,
        tools: 'Figma, Rive',
      }}
      websiteUrl="https://jetpacks.com"
      websiteLabel="Jetpacks"
    >
      <JetpacksLogoBoard
        captionLabel="The Approach"
        captionClassName={CASE_STUDY_OVERVIEW_COLUMNS_CLASS}
        caption={
          <p>
            Jetpacks needed a brand that students could recognize instantly and that could stand out among the growing number of AI study tools. I explored mascot concepts that could give the product a distinct visual hook and personality, while creating a foundation that could extend into illustration, motion, and the product experience.
          </p>
        }
      />
      <JetpacksBrandFamilyBoard
        captionClassName={CASE_STUDY_OVERVIEW_COLUMNS_CLASS}
        caption={
          <p>
            Jetpacks launched under General Learning (YC F24), alongside our existing brands RevisionDojo, OnePrep, and MathsGenie. I wanted the identity to feel connected to this family of products while establishing its own personality. Since Jetpacks was designed to grow with students beyond our curriculum-specific tools (IB, A-Levels, AP), the brand needed to feel flexible enough to resonate with students in college and beyond.
          </p>
        }
      />
      <JetpacksLoadingAnimation
        captionLabel="The Chicken was Born"
        caption={
          <p>
            Besides a strong visual hook tying in with the jetpacks feature, I wanted a mascot
            simple enough to read at icon size, expressive enough to carry empty states and
            marketing, and flexible enough to grow with the product across illustration and motion.
          </p>
        }
      />
      <JetpacksSilhouetteBoard
        caption={
          <p>
            When exploring mascot designs, it was crucial to reference the silhouette shape to
            ensure distinctiveness.
          </p>
        }
      />
      <JetpacksCastBoard />
      <JetpacksWavingAnimation caption="heyyy" />
      <JetpacksHomeBoard />
    </CaseStudyLayout>
  );
}
