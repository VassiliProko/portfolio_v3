'use client';

import Image from 'next/image';
import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Alignment } from '@rive-app/react-canvas';
import { X } from '@phosphor-icons/react';
import {
  ShowcaseRivePreview,
  type ShowcaseRivePlaybackMode,
} from '@/src/components/ui/ShowcaseRivePreview';
import { ShowcaseLoopingVideo } from '@/src/components/ui/ShowcaseLoopingVideo';
import { cn } from '@/src/utils/cn';

/** Optional Rive media — when set, preview plays this instead of a static `src` image. */
export type ImagePreviewRive = {
  src: string;
  playbackMode?: ShowcaseRivePlaybackMode;
  alignment?: Alignment;
  /** Surface behind the canvas (matches showcase card). */
  backgroundColor?: string;
};

/** Optional looping video media for the lightbox. */
export type ImagePreviewVideo = {
  sources: Array<{ src: string; type: string }>;
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
  /** Optional narrow-viewport frame ratio for custom media that needs a taller stage. */
  mobilePreviewAspectRatio?: number;
  /** How differently shaped custom media should fill its launch rectangle. */
  originFit?: 'contain' | 'cover';
  /** Unused — close control is always light. Kept for existing call sites. */
  captionTone?: 'default' | 'on-dark';
  /** When set, lightbox media is this Rive animation (same as work showcase). */
  rive?: ImagePreviewRive;
  /** When set, lightbox media is this looping video (takes precedence over image). */
  video?: ImagePreviewVideo;
  /** CSS background for the media frame (color or gradient). */
  mediaBackground?: string;
};

export type ImagePreviewOriginRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius: number;
};

/** Capture the on-page media bounds before opening the portalled lightbox. */
export const getImagePreviewOriginRect = (
  element: Element | null,
): ImagePreviewOriginRect | null => {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    borderRadius:
      Number.parseFloat(window.getComputedStyle(element).borderTopLeftRadius) || 0,
  };
};

/**
 * Hover zoom for media inside an ImagePreview trigger.
 * Parent hit target must include `group`. Use `overflow-hidden` to crop in-frame,
 * or `overflow-visible` so the media can break out of its frame.
 */
export const IMAGE_PREVIEW_TRIGGER_MEDIA_CLASS =
  'origin-center transform-gpu transition-transform duration-hover ease-soft will-change-transform group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100';

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
  /** Custom media rendered inside the standard fitted preview frame. */
  media?: React.ReactNode;
  /** Viewport bounds of the media that launched this preview. */
  originRect?: ImagePreviewOriginRect | null;
};

/** Desktop inset; narrow screens use the same 20px gutter as the homepage. */
const PREVIEW_DESKTOP_INSET_PX = 40;
const PREVIEW_MOBILE_INSET_PX = 20;
const PREVIEW_MOBILE_BREAKPOINT_PX = 768;
/** Cap preview width on ultra-wide / 4K viewports. */
const PREVIEW_MAX_WIDTH_PX = 2160;
/** Matches `--spacing-xs` / `gap-xs` between image, caption, and carousel. */
const PREVIEW_STACK_GAP_PX = 10;
const PREVIEW_CLOSE_ROW_HEIGHT_PX = 36;
const PREVIEW_RADIUS_PX = 8;
const PREVIEW_MIN_FRAME_HEIGHT_PX = 180;
const PREVIEW_SWIPE_DISTANCE_PX = 48;
const PREVIEW_SWIPE_VELOCITY_PX_PER_SECOND = 500;

const slideEase = [0.22, 1, 0.36, 1] as const;
const enterEase = [0.45, 0, 0.2, 1] as const;
type PreviewLayoutPhase = 'measuring' | 'entering' | 'settled';

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
  media,
  originRect = null,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [direction, setDirection] = React.useState(0);
  const [viewportSize, setViewportSize] = React.useState({
    width: PREVIEW_MAX_WIDTH_PX,
    height: 800,
  });
  const [chromeHeightPx, setChromeHeightPx] = React.useState(0);
  const [layoutPhase, setLayoutPhase] =
    React.useState<PreviewLayoutPhase>('measuring');
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const chromeRef = React.useRef<HTMLDivElement>(null);

  const gallery = items && items.length > 0 ? items : null;
  const isGallery = Boolean(gallery && gallery.length > 1);
  const safeIndex = gallery
    ? Math.min(Math.max(activeIndex, 0), gallery.length - 1)
    : 0;
  const activeItem = gallery ? gallery[safeIndex] : item;

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

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
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setMounted(true);
  }, []);

  // Focus the dialog itself so opening does not activate the close control.
  React.useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    // Lock the root scroller without turning `body` into a new scroll container.
    // A body overflow lock makes the sticky navbar lose its viewport anchor and
    // disappear before the lightbox backdrop has time to fade over it.
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
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

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleClose, isGallery, gallery, goToIndex, safeIndex]);

  React.useLayoutEffect(() => {
    if (!open) return;

    const syncViewport = () => {
      if (layoutPhase === 'entering') return;
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, [layoutPhase, open]);

  React.useEffect(() => {
    if (!open) setLayoutPhase('measuring');
  }, [open]);

  React.useLayoutEffect(() => {
    if (!open || !activeItem) return;

    const chrome = chromeRef.current;
    if (!chrome) return;

    // Measure once before entering. Repeatedly feeding the measured caption
    // height back into the frame width can oscillate when the viewport is
    // short and text wraps differently at each computed width.
    if (layoutPhase === 'measuring') {
      setChromeHeightPx(chrome.offsetHeight);
      setLayoutPhase('entering');
    }
  }, [
    open,
    activeItem,
    isGallery,
    safeIndex,
    layoutPhase,
    viewportSize.width,
    viewportSize.height,
  ]);

  if (!mounted) return null;

  const enterTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.62, ease: enterEase };
  const exitTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.4, 0, 1, 1] as const };
  const backdropTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: enterEase };
  const slideTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: slideEase };

  const imageWidth = activeItem?.width ?? 1200;
  const imageHeight = activeItem?.height ?? 675;
  const intrinsicAspect = imageWidth / imageHeight;
  const aspect =
    viewportSize.width < PREVIEW_MOBILE_BREAKPOINT_PX
      ? activeItem?.mobilePreviewAspectRatio ?? intrinsicAspect
      : intrinsicAspect;

  // Fit image + caption (+ carousel) + top/bottom insets inside the viewport.
  const previewInsetPx =
    viewportSize.width < PREVIEW_MOBILE_BREAKPOINT_PX
      ? PREVIEW_MOBILE_INSET_PX
      : PREVIEW_DESKTOP_INSET_PX;
  const availableHeightPx = Math.max(0, viewportSize.height - previewInsetPx * 2);
  const availableWidthPx = Math.max(
    0,
    Math.min(viewportSize.width - previewInsetPx * 2, PREVIEW_MAX_WIDTH_PX),
  );
  const stackGapPx =
    PREVIEW_STACK_GAP_PX +
    (chromeHeightPx > 0 ? PREVIEW_STACK_GAP_PX : 0);
  const stackChromeHeightPx = PREVIEW_CLOSE_ROW_HEIGHT_PX + chromeHeightPx;
  const fittedImageMaxHeightPx = Math.max(
    0,
    availableHeightPx - stackChromeHeightPx - stackGapPx,
  );
  const widthLimitedFrameHeightPx =
    aspect > 0 ? availableWidthPx / aspect : 0;
  const imageMaxHeightPx = Math.min(
    widthLimitedFrameHeightPx,
    Math.max(fittedImageMaxHeightPx, PREVIEW_MIN_FRAME_HEIGHT_PX),
  );
  const frameWidthPx = Math.max(0, Math.min(availableWidthPx, imageMaxHeightPx * aspect));
  const frameHeightPx = aspect > 0 ? frameWidthPx / aspect : 0;
  const stackHeightPx = frameHeightPx + stackGapPx + stackChromeHeightPx;
  const frameLeftPx = (viewportSize.width - frameWidthPx) / 2;
  const frameTopPx = (viewportSize.height - stackHeightPx) / 2;
  const hasOriginTransition = Boolean(
    !prefersReducedMotion &&
      originRect &&
      frameWidthPx > 0 &&
      frameHeightPx > 0,
  );
  const useOriginMaskMorph = Boolean(
    hasOriginTransition && originRect && media && activeItem?.originFit,
  );
  const originScaleX =
    hasOriginTransition && originRect ? originRect.width / frameWidthPx : 1;
  const originScaleY =
    hasOriginTransition && originRect ? originRect.height / frameHeightPx : 1;
  const fittedOriginScale =
    activeItem?.originFit === 'cover'
      ? Math.max(originScaleX, originScaleY)
      : Math.min(originScaleX, originScaleY);
  // Keep the same clip-path grammar at both ends so the crop and corner radius
  // interpolate continuously instead of the browser swapping the final shape.
  const finalFrameClipPath = `inset(0px 0px 0px 0px round ${PREVIEW_RADIUS_PX}px)`;
  const originClipX = originRect
    ? Math.max(0, (frameWidthPx - originRect.width / fittedOriginScale) / 2)
    : 0;
  const originClipY = originRect
    ? Math.max(0, (frameHeightPx - originRect.height / fittedOriginScale) / 2)
    : 0;
  const originFrameClipPath = originRect
    ? `inset(${originClipY}px ${originClipX}px ${originClipY}px ${originClipX}px round ${originRect.borderRadius / fittedOriginScale}px)`
    : finalFrameClipPath;
  const frameInitial =
    hasOriginTransition && originRect
      ? {
          x:
            originRect.left + originRect.width / 2 -
            (frameLeftPx + frameWidthPx / 2),
          y:
            originRect.top + originRect.height / 2 -
            (frameTopPx + frameHeightPx / 2),
          ...(useOriginMaskMorph
            ? {
                scale: fittedOriginScale,
                clipPath: originFrameClipPath,
              }
            : { scale: fittedOriginScale }),
        }
      : prefersReducedMotion
        ? false
        : { opacity: 0, scale: 0.96 };
  const mediaInitial = useOriginMaskMorph
    ? {
        opacity: 1,
        x: 0,
      }
    : prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: direction * 28 };

  return createPortal(
    <AnimatePresence>
      {open && activeItem ? (
        <div
          ref={dialogRef}
          key="image-preview"
          className="fixed inset-0 z-[100] overflow-x-hidden overflow-y-auto overscroll-contain outline-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.name} image preview`}
          tabIndex={-1}
        >
          {originRect ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bg-background"
              style={{
                left: originRect.left,
                top: originRect.top,
                width: originRect.width,
                height: originRect.height,
                borderRadius: originRect.borderRadius,
              }}
              initial={false}
              exit={{ opacity: 0 }}
              transition={exitTransition}
            />
          ) : null}

          <motion.div
            aria-hidden
            className="fixed inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: exitTransition }}
            transition={backdropTransition}
          />
          <motion.button
            type="button"
            aria-label="Close image preview"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: exitTransition }}
            transition={backdropTransition}
            onClick={handleClose}
          />

          <motion.div
            className="relative z-[1] box-border flex min-h-full w-full items-center justify-center"
            style={{ padding: previewInsetPx }}
            initial={false}
            onClick={handleClose}
          >
            <motion.div
              key={layoutPhase === 'measuring' ? 'preview-measurement' : 'preview'}
              className={cn(
                'flex max-w-full flex-col gap-xs',
                layoutPhase === 'measuring' &&
                  'pointer-events-none invisible',
              )}
              style={{ width: frameWidthPx > 0 ? frameWidthPx : undefined }}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, y: -12, transition: exitTransition }
              }
              transition={exitTransition}
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.34, delay: 0.5, ease: enterEase }
                }
                onClick={handleClose}
                className="flex h-9 w-full shrink-0 cursor-zoom-out items-center justify-end"
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close preview"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClose();
                  }}
                  className={cn(
                    'inline-flex size-9 cursor-pointer items-center justify-center rounded-sm',
                    'bg-overlay-uniform text-footer-console-text opacity-70 backdrop-blur-2xl backdrop-saturate-150',
                    'transition-opacity duration-micro ease-snap hover:opacity-100 focus-visible:opacity-100',
                    'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2',
                  )}
                >
                  <X size={20} aria-hidden />
                </button>
              </motion.div>

              <motion.div
                className="relative w-full shrink-0 overflow-hidden rounded-image-preview bg-background"
                style={{
                  aspectRatio: aspect,
                  maxHeight: imageMaxHeightPx,
                  touchAction: isGallery ? 'pan-y' : undefined,
                  clipPath: finalFrameClipPath,
                  background:
                    activeItem.mediaBackground ?? activeItem.rive?.backgroundColor,
                }}
                onPanEnd={(_, info) => {
                  if (!isGallery || layoutPhase !== 'settled') return;

                  if (
                    info.offset.x <= -PREVIEW_SWIPE_DISTANCE_PX ||
                    info.velocity.x <= -PREVIEW_SWIPE_VELOCITY_PX_PER_SECOND
                  ) {
                    goToIndex(safeIndex + 1);
                  } else if (
                    info.offset.x >= PREVIEW_SWIPE_DISTANCE_PX ||
                    info.velocity.x >= PREVIEW_SWIPE_VELOCITY_PX_PER_SECOND
                  ) {
                    goToIndex(safeIndex - 1);
                  }
                }}
                initial={frameInitial}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  clipPath: finalFrameClipPath,
                }}
                transition={enterTransition}
                onAnimationComplete={() => {
                  if (layoutPhase === 'entering') {
                    setLayoutPhase('settled');
                  }
                }}
              >
                <AnimatePresence
                  initial={useOriginMaskMorph}
                  custom={direction}
                  mode="sync"
                >
                  <motion.div
                    key={
                      media
                        ? `custom-${activeItem.src}`
                        : activeItem.video?.sources[0]?.src ??
                      activeItem.rive?.src ??
                      activeItem.src
                    }
                    className="absolute -inset-[2px]"
                    custom={direction}
                    initial={mediaInitial}
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
                    {media ? (
                      media
                    ) : activeItem.video ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShowcaseLoopingVideo
                          sources={activeItem.video.sources}
                          className="pointer-events-none h-full w-auto max-w-full select-none object-contain"
                          ariaLabel={
                            activeItem.alt ??
                            activeItem.description ??
                            activeItem.name
                          }
                        />
                      </div>
                    ) : activeItem.rive ? (
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
              </motion.div>

              <motion.div
                ref={chromeRef}
                className="flex w-full shrink-0 flex-col gap-xs"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.34, delay: 0.5, ease: enterEase }
                }
              >
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
                            'size-2 rounded-full transition-colors duration-medium ease-move',
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
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};
