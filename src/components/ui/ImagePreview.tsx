'use client';

import Image from 'next/image';
import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/src/utils/cn';

/** Metadata attached to any image that can open in the preview lightbox. */
export type ImagePreviewItem = {
  src: string;
  name: string;
  description: string;
  alt?: string;
  width?: number;
  height?: number;
  /**
   * `on-dark` — white chrome (caption + close icon) over dark artwork.
   * Colors are fixed so they do not flip with the site theme.
   */
  captionTone?: 'default' | 'on-dark';
};

type ImagePreviewProps = {
  item: ImagePreviewItem | null;
  open: boolean;
  onClose: () => void;
};

/** Default page margin (20px) × 2 — keeps screen edges visible around the preview. */
const PREVIEW_INSET_PX = 40;
/** Cap preview width on ultra-wide / 4K viewports. */
const PREVIEW_MAX_WIDTH_PX = 2160;

/**
 * Full-screen image lightbox. Reuse anywhere by passing an `ImagePreviewItem`
 * and controlling `open` / `onClose` (e.g. from a zoom-cursor trigger).
 *
 * @example
 * const [item, setItem] = useState<ImagePreviewItem | null>(null);
 * <button type="button" className="cursor-zoom-in" onClick={() => setItem(meta)} />
 * <ImagePreview item={item} open={Boolean(item)} onClose={() => setItem(null)} />
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({ item, open, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    // Reset scroll so each open starts at title + first description line.
    scrollRef.current?.scrollTo({ top: 0 });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const enterTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, duration: 0.45, bounce: 0 };
  const exitTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.4, 0, 1, 1] as const };
  const backdropTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const };

  const imageWidth = item?.width ?? 1200;
  const imageHeight = item?.height ?? 675;
  const aspect = imageWidth / imageHeight;
  const onDark = item?.captionTone === 'on-dark';

  /** Always-light chrome for dark artwork — ignores theme inverted tokens. */
  const chromeTextClass = onDark ? 'text-footer-console-text' : 'text-text';

  const frameMaxHeight = `calc(100vh - ${PREVIEW_INSET_PX * 2}px)`;
  const frameWidth = `min(100%, ${PREVIEW_MAX_WIDTH_PX}px, calc(${frameMaxHeight} * ${aspect}))`;

  return createPortal(
    <AnimatePresence>
      {open && item ? (
        <div
          key="image-preview"
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} image preview`}
        >
          {/*
            Opaque dark underlay so rounded-corner AA never samples the light page.
          */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-surface-dark-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
          />
          <motion.button
            type="button"
            aria-label="Close image preview"
            className="absolute inset-0 bg-overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            onClick={onClose}
          />

          <motion.div
            className="relative z-[1] flex h-full w-full items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: exitTransition }}
            transition={backdropTransition}
            onClick={onClose}
          >
            <div
              className="flex w-full items-center justify-center"
              style={{
                padding: PREVIEW_INSET_PX,
                maxWidth: PREVIEW_MAX_WIDTH_PX + PREVIEW_INSET_PX * 2,
              }}
              onClick={(event) => event.stopPropagation()}
            >
              {/*
                Scale lives on this wrapper only — keep radius/overflow on the
                child so transform compositing does not fringe the corners.
              */}
              <motion.div
                className="max-w-full"
                style={{ width: frameWidth }}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, scale: 0.98, transition: exitTransition }
                }
                transition={enterTransition}
              >
                {/*
                  Frame is exactly the image aspect — never shrunk for caption.
                  Caption overlays and scrolls independently on top.
                */}
                <div
                  className="relative w-full overflow-hidden rounded-image-preview bg-surface-dark-3"
                  style={{
                    aspectRatio: `${imageWidth} / ${imageHeight}`,
                    maxHeight: frameMaxHeight,
                    clipPath: 'inset(0 round var(--radius-image-preview))',
                  }}
                >
                  {/*
                    Slight overscan hides JPEG edge mats / encode fringes that
                    otherwise read as a white arc along the rounded clip.
                  */}
                  <div className="absolute -inset-[2px]">
                    <Image
                      src={item.src}
                      alt={item.alt ?? item.name}
                      fill
                      className="pointer-events-none select-none object-cover"
                      sizes={`(max-width: 768px) 100vw, min(100vw, ${PREVIEW_MAX_WIDTH_PX}px)`}
                      priority
                    />
                  </div>

                  {/* Close stays pinned to the frame */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end p-md">
                    <button
                      ref={closeButtonRef}
                      type="button"
                      aria-label="Close preview"
                      onClick={onClose}
                      className={cn(
                        'pointer-events-auto inline-flex size-9 items-center justify-center rounded-sm',
                        'bg-overlay-uniform opacity-70 backdrop-blur-2xl backdrop-saturate-150',
                        'transition-opacity duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
                        'hover:opacity-100 focus-visible:opacity-100',
                        'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2',
                        chromeTextClass,
                      )}
                    >
                      <X size={20} strokeWidth={2} aria-hidden />
                    </button>
                  </div>

                  {/*
                    Caption reveal scroll: spacer parks title + first description
                    line at the bottom; further scroll moves caption up over the
                    still image.
                  */}
                  <div
                    ref={scrollRef}
                    className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-overlay"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none w-full"
                      style={{
                        height: 'calc(100% - var(--size-image-preview-caption-peek))',
                      }}
                    />
                    <div className="px-md pb-md">
                      <div
                        className={cn(
                          'relative min-w-image-preview-caption w-full max-w-[60ch] p-md',
                          onDark && 'rounded-sm',
                        )}
                      >
                        {onDark ? (
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 -z-[1] rounded-sm bg-gradient-to-tr from-overlay-backdrop via-overlay-uniform to-transparent backdrop-blur-md"
                          />
                        ) : null}
                        <div
                          className={cn(
                            'w-full font-sans text-sm font-medium leading-none',
                            chromeTextClass,
                          )}
                        >
                          {item.name}
                        </div>
                        <p
                          className={cn(
                            'mt-2xs w-full whitespace-pre-line font-sans text-sm leading-relaxed',
                            chromeTextClass,
                          )}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};
