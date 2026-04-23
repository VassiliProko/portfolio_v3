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
      I led the visual brand direction for Applicable, a platform that connects mentors and
      learners through real, project-based creative challenges. The product was developed as part
      of a human-centered design and AI program at Studio School.
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
        time: 'Feb 2026 - Apr 2026',
        role: 'Design Researcher',
        tools: 'Figma, Next.Js, Supabase, Vercel',
        skills: 'Human Centered Research, Brand Design, AI-Assisted Web Application Development',
      }}
      backHref="/#work"
    >
      <CaseStudyImage
        src="/images/optimized/applicable/mockup_bus.webp"
        alt="Applicable case study mockup"
      />
      <CaseStudyImage
        src="/images/optimized/applicable/applicable_team.webp"
        alt="Applicable team collaboration"
      />
    </CaseStudyLayout>
  );
}
