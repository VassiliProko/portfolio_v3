'use client';

import React from 'react';
import { cn } from '@/src/utils/cn';

export interface CaseStudyImageProps {
  src: string;
  alt: string;
  /** Optional caption below the image */
  caption?: string;
  className?: string;
}

export const CaseStudyImage: React.FC<CaseStudyImageProps> = ({
  src,
  alt,
  caption,
  className,
}) => {
  return (
    <figure className={cn('w-full', className)}>
      <div className="relative w-full rounded-[8px] overflow-hidden bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block"
          loading="lazy"
          decoding="async"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-sm text-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
