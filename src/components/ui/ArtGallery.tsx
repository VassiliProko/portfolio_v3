'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

export interface ArtGalleryItem {
  title: string;
  year: string;
  /** Optional image src; when omitted, a placeholder is shown */
  imageSrc?: string;
  imageAlt?: string;
}

export interface ArtGalleryProps {
  items: ArtGalleryItem[];
}

export const ArtGallery: React.FC<ArtGalleryProps> = ({ items }) => {
  const [lightboxItem, setLightboxItem] = useState<ArtGalleryItem | null>(null);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  useEffect(() => {
    if (!lightboxItem) return;
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && closeLightbox();
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [lightboxItem, closeLightbox]);

  return (
    <>
      <div className="columns-1 sm:columns-2 [column-gap:0.75rem] md:[column-gap:1rem]">
        {items.map((item, index) => (
          <article
            key={`${item.title}-${item.year}-${index}`}
            className="flex flex-col break-inside-avoid mb-6 [&:last-child]:mb-0"
          >
            {/* Image area — no fixed aspect; image height shows fully, hover zoom, click opens lightbox */}
            <div className="relative w-full rounded-lg overflow-hidden bg-surface-1 border border-border-base">
              {item.imageSrc ? (
                <button
                  type="button"
                  onClick={() => item.imageSrc && setLightboxItem(item)}
                  className="block w-full focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-lg overflow-hidden group cursor-zoom-in"
                  aria-label={`View ${item.title} full size`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt ?? item.title}
                    className="w-full h-auto block transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:scale-100 motion-reduce:transition-none"
                  />
                </button>
              ) : (
                <div
                  className="w-full min-h-[200px] flex items-center justify-center text-text-muted font-mono text-sm"
                  aria-hidden
                >
                  Image
                </div>
              )}
            </div>

            {/* Title + year — hero-stats style */}
            <div className="mt-xs rounded-lg bg-surface-dark-1 text-text-inverted-1 px-3 py-2">
              <div className="flex flex-row flex-wrap items-baseline justify-between gap-x-2 gap-y-0">
                <span className="text-sm font-mono">{item.title}</span>
                <span className="text-sm font-mono text-text-inverted-2 shrink-0">
                  {item.year}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox — nearly full screen image with X to close */}
      {lightboxItem?.imageSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${lightboxItem.title}`}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-surface-dark-1 text-text-inverted-1 hover:bg-surface-dark-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-colors"
            aria-label="Close"
          >
            <X size={24} strokeWidth={2} />
          </button>
          <div className="relative max-w-[92vw] max-h-[92vh] w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxItem.imageSrc}
              alt={lightboxItem.imageAlt ?? lightboxItem.title}
              className="max-w-full max-h-[92vh] w-auto h-auto object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};
