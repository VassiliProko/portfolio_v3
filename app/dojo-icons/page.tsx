import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';
import { BackgroundSafeVideo } from '@/src/components/ui/BackgroundSafeVideo';
import { DojoIconHeroBoard } from '@/src/components/ui/DojoIconHeroBoard';
import { DojoIconPreviewBoards } from '@/src/components/ui/DojoIconPreviewBoards';

export const metadata: Metadata = {
  title: 'RevisionDojo Icons',
  description:
    'Icon system revamp for RevisionDojo, the world\'s largest IB platform used by 650k+ students.',
};

const DOJO_ICONS_OVERVIEW = (
  <p>
    During my internship at General Learning (YC F24), I revamped 80+ icons for RevisionDojo, the
    world&apos;s largest IB platform used by 650k+ students.
  </p>
);

export default function DojoIconsCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="RevisionDojo Icons"
      hero={<DojoIconHeroBoard />}
      overview={DOJO_ICONS_OVERVIEW}
      meta={{
        role: 'Designer',
        tools: 'Figma',
        skills: 'Visual design',
      }}
    >
      <figure className="m-0 flex w-full flex-col gap-2xs">
        <div className="w-full overflow-hidden rounded-[8px] bg-surface-2 p-3 md:p-5">
          <div className="w-full overflow-hidden rounded-lg">
            <BackgroundSafeVideo
              className="pointer-events-none block h-auto w-full"
              sources={[
                { src: '/other/dojo-icons-preview-new.webm', type: 'video/webm' },
                { src: '/other/dojo-icons-preview-new.mp4', type: 'video/mp4' },
              ]}
              loop
              aria-label="RevisionDojo icons preview animation"
            />
          </div>
        </div>
        <figcaption className="type-paragraph m-0 text-text-subtle">
          Icon preview animation made with Cursor
        </figcaption>
      </figure>

      <DojoIconPreviewBoards />
    </CaseStudyLayout>
  );
}
