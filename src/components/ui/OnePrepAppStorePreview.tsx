'use client';

import Image from 'next/image';
import React from 'react';
import {
  ImagePreview,
  type ImagePreviewItem,
} from '@/src/components/ui/ImagePreview';
import { cn } from '@/src/utils/cn';
import styles from './OnePrepAppStorePreview.module.css';

const ONEPREP_APP_STORE_PREVIEWS: ImagePreviewItem[] = [
  {
    src: '/images/optimized/oneprep-app-store/home-screen-widgets.png',
    name: 'OnePrep App Store Previews',
    description: 'App Store preview screenshots showcasing the OnePrep SAT study app.',
    alt: 'OnePrep App Store preview featuring home screen widgets',
    width: 1241,
    height: 2688,
  },
  {
    src: '/images/optimized/oneprep-app-store/challenge-questions.png',
    name: 'OnePrep App Store Previews',
    description: 'App Store preview screenshots showcasing the OnePrep SAT study app.',
    alt: 'OnePrep App Store preview featuring challenge questions',
    width: 1241,
    height: 2688,
  },
  {
    src: '/images/optimized/oneprep-app-store/performance-analytics.png',
    name: 'OnePrep App Store Previews',
    description: 'App Store preview screenshots showcasing the OnePrep SAT study app.',
    alt: 'OnePrep App Store preview featuring performance analytics',
    width: 1241,
    height: 2688,
  },
  {
    src: '/images/optimized/oneprep-app-store/sat-masterclass.png',
    name: 'OnePrep App Store Previews',
    description: 'App Store preview screenshots showcasing the OnePrep SAT study app.',
    alt: 'OnePrep App Store preview featuring the SAT Masterclass',
    width: 1241,
    height: 2688,
  },
  {
    src: '/images/optimized/oneprep-app-store/personalized-study-plan.png',
    name: 'OnePrep App Store Previews',
    description: 'App Store preview screenshots showcasing the OnePrep SAT study app.',
    alt: 'OnePrep App Store preview featuring a personalized study plan',
    width: 1241,
    height: 2688,
  },
  {
    src: '/images/optimized/oneprep-app-store/improve-sat-score.png',
    name: 'OnePrep App Store Previews',
    description: 'App Store preview screenshots showcasing the OnePrep SAT study app.',
    alt: 'OnePrep App Store preview featuring student SAT score outcomes',
    width: 1241,
    height: 2688,
  },
];

const ONEPREP_ANIMATION_PREVIEW: ImagePreviewItem = {
  src: '/images/optimized/oneprep-app-store/home-screen-widgets.png',
  name: 'App Store Previews',
  description:
    'Previews for OnePrep mobile app, an All-in-One Resource for the SAT, ACT, and AP',
  alt: 'Animated strip of OnePrep App Store preview screenshots',
  width: 16,
  height: 9,
  mediaBackground: '#071827',
};

type OnePrepAppStorePreviewProps = {
  onPreviewOpen?: () => void;
};

export function OnePrepAppStorePreview({ onPreviewOpen }: OnePrepAppStorePreviewProps) {
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const openPreview = () => {
    setPreviewOpen(true);
    onPreviewOpen?.();
  };

  const renderPreviewGroup = (duplicate = false, interactive = true) => (
    <div
      className={cn(styles.group, duplicate && styles.duplicateGroup)}
      aria-hidden={duplicate || !interactive || undefined}
    >
      {ONEPREP_APP_STORE_PREVIEWS.map((item) => {
        const PreviewElement = interactive ? 'button' : 'div';

        return (
          <PreviewElement
            key={`${duplicate ? 'duplicate' : 'primary'}-${item.src}`}
            {...(interactive ? { type: 'button' as const } : {})}
            className={cn(
              styles.previewButton,
              interactive &&
                'cursor-zoom-in focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
            )}
            aria-label={interactive ? `Enlarge ${item.alt}` : undefined}
            tabIndex={interactive && duplicate ? -1 : undefined}
            onClick={interactive ? openPreview : undefined}
          >
            <Image
              src={item.src}
              alt={duplicate || !interactive ? '' : item.description}
              width={item.width}
              height={item.height}
              className={styles.previewImage}
              sizes="(max-width: 767px) 132px, (max-width: 1279px) 150px, 162px"
              draggable={false}
            />
          </PreviewElement>
        );
      })}
    </div>
  );

  return (
    <>
      <div className={cn('relative', styles.surface)}>
        <div
          className={styles.rail}
          aria-label="OnePrep App Store previews"
          role="region"
        >
          <div className={styles.track}>
            {renderPreviewGroup()}
            {renderPreviewGroup(true)}
          </div>
        </div>
      </div>

      <ImagePreview
        item={ONEPREP_ANIMATION_PREVIEW}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        media={
          <div className={styles.lightboxMedia}>
            <div
              className={styles.rail}
              aria-label="Animated OnePrep App Store previews"
              role="img"
            >
              <div className={styles.track}>
                {renderPreviewGroup(false, false)}
                {renderPreviewGroup(true, false)}
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
