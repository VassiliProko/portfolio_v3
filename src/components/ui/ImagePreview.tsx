'use client';

import Image from 'next/image';
import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Alignment } from '@rive-app/react-canvas';
import { X } from 'lucide-react';
import {
  ShowcaseRivePreview,
  type ShowcaseRivePlaybackMode,
} from '@/src/components/ui/ShowcaseRivePreview';
import { cn } from '@/src/utils/cn';

/** Optional Rive media — when set, preview plays this instead of a static `src` image. */
export type ImagePreviewRive = {
  src: string;
  playbackMode?: ShowcaseRivePlaybackMode;
  alignment?: Alignment;
  /** Surface behind the canvas (matches showcase card). */
  backgroundColor?: string;
};

/** Metadata attached to any image that can open in the preview lightbox. */
export type ImagePreviewItem = {
  src: string;
  name: string;
  description: string;
  /**
   * Optional accessible label. Defaults to `description`, then `name`.
   */
  alt?: string;
  width?: number;
  height?: number;
  /** Unused — close control is always light. Kept for existing call sites. */
  captionTone?: 'default' | 'on-dark';
  /** When set, lightbox media is this Rive animation (same as work showcase). */
  rive?: ImagePreviewRive;
};

/**
 * Hover zoom for media inside an ImagePreview trigger.
 * Parent hit target must include `group`. Use `overflow-hidden` to crop in-frame,
 * or `overflow-visible` so the media can break out of its frame.
 */
export const IMAGE_PREVIEW_TRIGGER_MEDIA_CLASS =
  'origin-center transform-gpu transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100';

type ImagePreviewProps = {
  /** Single-image mode (e.g. Yinlin). Ignored when `items` is provided. */
  item?: ImagePreviewItem | null;
  /** Gallery mode — enables dots + arrow-key navigation. */
  items?: ImagePreviewItem[];
  /** Controlled index into `items`. */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  open: boolean;
  onClose: () => void;
};

/** Top/bottom (and side) margin around the full preview stack. */
const PREVIEW_INSET_PX = 40;
/** Cap preview width on ultra-wide / 4K viewports. */
const PREVIEW_MAX_WIDTH_PX = 2160;
/** Matches `--spacing-xs` / `gap-xs` between image, caption, and carousel. */
const PREVIEW_STACK_GAP_PX = 10;

const slideEase = [0.22, 1, 0.36, 1] as const;

/**
 * Full-screen image lightbox. Pass `items` + `activeIndex` for a gallery
 * (dots + ←/→). Pass a single `item` for one-off previews.
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({
  item = null,
  items,
  activeIndex = 0,
  onActiveIndexChange,
  open,
  onClose,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [direction, setDirection] = React.useState(0);
  const [viewportSize, setViewportSize] = React.useState({
    width: PREVIEW_MAX_WIDTH_PX,
    height: 800,
  });
  const [chromeHeightPx, setChromeHeightPx] = React.useState(0);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const chromeRef = React.useRef<HTMLDivElement>(null);

  const gallery = items && items.length > 0 ? items : null;
  const isGallery = Boolean(gallery && gallery.length > 1);
  const safeIndex = gallery
    ? Math.min(Math.max(activeIndex, 0), gallery.length - 1)
    : 0;
  const activeItem = gallery ? gallery[safeIndex] : item;

  const goToIndex = React.useCallback(
    (nextIndex: number) => {
      if (!gallery || !onActiveIndexChange) return;
      const len = gallery.length;
      const wrapped = ((nextIndex % len) + len) % len;
      if (wrapped === safeIndex) return;
      const forwardSteps = (wrapped - safeIndex + len) % len;
      const backwardSteps = (safeIndex - wrapped + len) % len;
      setDirection(forwardSteps <= backwardSteps ? 1 : -1);
      onActiveIndexChange(wrapped);
    },
    [gallery, onActiveIndexChange, safeIndex],
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Focus close only when the lightbox opens — not on every gallery index change.
  React.useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    // Lock both roots — viewport scroll often lives on `html`, not only `body`.
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (!isGallery || !gallery) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToIndex(safeIndex + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToIndex(safeIndex - 1);
      }
    };

    // Block wheel/touch scroll from reaching the page behind the lightbox.
    const preventScroll = (event: Event) => {
      event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [open, onClose, isGallery, gallery, goToIndex, safeIndex]);

  React.useLayoutEffect(() => {
    if (!open) return;

    const syncViewport = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, [open]);

  React.useLayoutEffect(() => {
    if (!open || !activeItem) return;

    const chrome = chromeRef.current;
    if (!chrome) return;

    const syncChromeHeight = () => {
      setChromeHeightPx(chrome.offsetHeight);
    };

    syncChromeHeight();
    const observer = new ResizeObserver(syncChromeHeight);
    observer.observe(chrome);
    return () => observer.disconnect();
  }, [open, activeItem, isGallery, safeIndex]);

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
  const slideTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: slideEase };

  const imageWidth = activeItem?.width ?? 1200;
  const imageHeight = activeItem?.height ?? 675;
  const aspect = imageWidth / imageHeight;

  // Fit image + caption (+ carousel) + top/bottom insets inside the viewport.
  const availableHeightPx = Math.max(0, viewportSize.height - PREVIEW_INSET_PX * 2);
  const availableWidthPx = Math.max(
    0,
    Math.min(viewportSize.width - PREVIEW_INSET_PX * 2, PREVIEW_MAX_WIDTH_PX),
  );
  const stackGapPx = chromeHeightPx > 0 ? PREVIEW_STACK_GAP_PX : 0;
  const imageMaxHeightPx = Math.max(0, availableHeightPx - chromeHeightPx - stackGapPx);
  const frameWidthPx = Math.max(0, Math.min(availableWidthPx, imageMaxHeightPx * aspect));

  return createPortal(
    <AnimatePresence>
      {open && activeItem ? (
        <div
          key="image-preview"
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.name} image preview`}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
          />
          <motion.button
            type="button"
            aria-label="Close image preview"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            onClick={onClose}
          />

          <motion.div
            className="relative z-[1] box-border flex h-full w-full items-center justify-center"
            style={{ padding: PREVIEW_INSET_PX }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: exitTransition }}
            transition={backdropTransition}
            onClick={onClose}
          >
            <motion.div
              className="flex max-h-full max-w-full flex-col gap-xs"
              style={{ width: frameWidthPx > 0 ? frameWidthPx : undefined }}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, scale: 0.98, transition: exitTransition }
              }
              transition={enterTransition}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="relative w-full shrink-0 overflow-hidden rounded-image-preview bg-background"
                style={{
                  aspectRatio: `${imageWidth} / ${imageHeight}`,
                  maxHeight: imageMaxHeightPx,
                  clipPath: 'inset(0 round var(--radius-image-preview))',
                  backgroundColor: activeItem.rive?.backgroundColor,
                }}
              >
                <AnimatePresence initial={false} custom={direction} mode="sync">
                  <motion.div
                    key={activeItem.rive?.src ?? activeItem.src}
                    className="absolute -inset-[2px]"
                    custom={direction}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: direction * 28,
                          }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: direction * -28,
                          }
                    }
                    transition={slideTransition}
                  >
                    {activeItem.rive ? (
                      <ShowcaseRivePreview
                        riveSrc={activeItem.rive.src}
                        ariaLabel={
                          activeItem.alt ?? activeItem.description ?? activeItem.name
                        }
                        playbackMode={activeItem.rive.playbackMode}
                        riveAlignment={activeItem.rive.alignment}
                      />
                    ) : (
                      <Image
                        src={activeItem.src}
                        alt={activeItem.alt ?? activeItem.description ?? activeItem.name}
                        fill
                        className="pointer-events-none select-none object-cover"
                        sizes={`(max-width: 768px) 100vw, min(100vw, ${PREVIEW_MAX_WIDTH_PX}px)`}
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end p-md">
                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Close preview"
                    onClick={onClose}
                    className={cn(
                      'pointer-events-auto inline-flex size-9 items-center justify-center rounded-sm',
                      'bg-overlay-uniform text-footer-console-text opacity-70 backdrop-blur-2xl backdrop-saturate-150',
                      'transition-opacity duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)]',
                      'hover:opacity-100 focus-visible:opacity-100',
                      'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2',
                    )}
                  >
                    <X size={20} strokeWidth={2} aria-hidden />
                  </button>
                </div>
              </div>

              <div ref={chromeRef} className="flex w-full shrink-0 flex-col gap-xs">
                <div className="relative w-full rounded-image-preview bg-surface-1 p-md">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={`${activeItem.src}-caption`}
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.2, ease: slideEase }
                      }
                    >
                      <div className="type-label w-full text-text-subtle">
                        {activeItem.name}
                      </div>
                      <p className="type-paragraph m-0 mt-[4px] mb-[4px] w-full max-w-[80ch]">
                        {activeItem.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {isGallery && gallery ? (
                  <div
                    className="flex items-center justify-center gap-2xs"
                    role="tablist"
                    aria-label="Gallery images"
                  >
                    {gallery.map((galleryItem, index) => {
                      const isActive = index === safeIndex;
                      return (
                        <button
                          key={galleryItem.src}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-label={`Show ${galleryItem.name}`}
                          onClick={() => goToIndex(index)}
                          className={cn(
                            'size-2 rounded-full transition-colors duration-[180ms] ease-move',
                            'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2',
                            isActive
                              ? 'bg-text'
                              : 'bg-surface-3 hover:bg-text-muted',
                          )}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};
