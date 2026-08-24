import type { ReactNode } from 'react';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import {
  caseStudyCaptionFigureGapClass,
  resolveCaseStudyCaptionLayout,
  type CaseStudyCaptionLayout,
} from '@/src/constants/caseStudy';
import { cn } from '@/src/utils/cn';

/** Half of CaseStudyLayout children spacing (`gap-4 md:gap-8` → `gap-2 md:gap-4`). */
const MEDIA_GAP_CLASS = 'gap-2 md:gap-4';

const SILHOUETTE_ASSETS = [
  {
    id: 'sidebar-dead',
    src: '/images/optimized/jetpacks/jetpacks-sidebar-dead.svg',
    alt: 'Jetpacks sidebar empty state with dead chick mascot',
    width: 360,
    height: 269,
    className: 'max-h-[78%] max-w-[88%]',
    cellClassName: 'bg-surface-1 dark:bg-jetpacks-media',
  },
  {
    id: 'logomark-silhouette',
    src: '/images/optimized/jetpacks/jetpacks-logomark-silhouette.svg',
    alt: 'Jetpacks logomark silhouette',
    width: 155,
    height: 161,
    className: 'max-h-[58%] max-w-[58%]',
    cellClassName: 'bg-jetpacks-silhouette',
  },
] as const;

type JetpacksSilhouetteBoardProps = {
  caption?: ReactNode;
  captionClassName?: string;
  captionLayout?: CaseStudyCaptionLayout;
};

/** Mascot exploration pair — sidebar empty state + logomark silhouette. */
export function JetpacksSilhouetteBoard({
  caption,
  captionClassName,
  captionLayout = 'section',
}: JetpacksSilhouetteBoardProps) {
  const layout = resolveCaseStudyCaptionLayout({
    captionClassName,
    captionLayout,
  });

  return (
    <figure
      className={cn(
        'm-0 flex w-full flex-col',
        caption && caseStudyCaptionFigureGapClass(layout)
      )}
    >
      <div className={cn('grid grid-cols-2', MEDIA_GAP_CLASS)}>
        {SILHOUETTE_ASSETS.map((asset) => (
          <div
            key={asset.id}
            className={cn(
              'flex aspect-square items-center justify-center overflow-hidden rounded-[8px] p-md md:p-lg',
              asset.cellClassName
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand assets; keep crisp vectors */}
            <img
              src={asset.src}
              alt={asset.alt}
              width={asset.width}
              height={asset.height}
              className={cn(
                'pointer-events-none h-auto w-auto select-none object-contain',
                asset.className
              )}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
      {caption ? (
        <CaseStudyCaption
          caption={caption}
          captionClassName={captionClassName}
          captionLayout={captionLayout}
        />
      ) : null}
    </figure>
  );
}
