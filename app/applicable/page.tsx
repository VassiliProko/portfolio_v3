import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { CaseStudyImage } from '@/src/components/ui/CaseStudyImage';

export const metadata: Metadata = {
  title: 'Applicable',
  description:
    'Case study for Applicable, a project-based mentoring platform shaped through human-centered research and AI prototyping.',
};

const APPLICABLE_OVERVIEW = (
  <>
    <p>
      Applicable is a platform that connects mentors and
      learners through real, project-based creative challenges. The product was developed as part
      of Studio School, a human-centered design x AI program, in collaboration with 3 other design researchers.
    </p>
    <p className="mt-4">
      The final MVP was presented to senior designers and early-stage investors, where it received
      critical feedback on growth, positioning, and future development.
    </p>
  </>
);

export default function ApplicableCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="Applicable"
      heroImageSrc="/images/optimized/applicable/applicable-head.webp"
      heroImageAlt="Applicable case study preview"
      overview={APPLICABLE_OVERVIEW}
      meta={{
        role: 'Design Researcher',
        tools: 'Figma, Next.Js, Supabase, Vercel, Claude Code',
        skills: 'Human Centered Research, Brand Design, AI-Assisted Web Application Development',
      }}
      backHref="/#work"
    >
      <CaseStudyImage
        src="/images/optimized/applicable/mockup_bus.webp"
        alt="Applicable case study mockup"
      />
    </CaseStudyLayout>
  );
}
