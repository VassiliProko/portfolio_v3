'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { createPortal } from 'react-dom';

type PlaygroundItem = {
  title: string;
  year: string;
  description?: string;
  tools?: string[];
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
  riveSrc?: string;
  riveStateMachine?: string;
  mediaClassName?: string;
};

const RIVE_BG =
  'linear-gradient(180deg, #000000 0%, #1F2638 100%), linear-gradient(180deg, #C5E8F3 0%, #E4E4E4 100%)';

const RiveCard: React.FC<{ src: string; stateMachine?: string; className?: string }> = ({ src, stateMachine, className }) => {
  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine ?? 'Default',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  return (
    <div className={className ?? 'w-full aspect-[4/5] max-h-[600px]'} style={{ background: RIVE_BG }}>
      <RiveComponent className="h-full w-full" />
    </div>
  );
};

const PLAYGROUND_ORDER: string[] = ['Watching You', 'Discord Snowsgiving', 'Hearts in Submission'];

const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    title: 'Watching You',
    year: '2025',
    description: 'Interactive Rive animation with eye-tracking state machine.',
    tools: ['Rive', 'Procreate'],
    riveSrc: '/other/landing-graphic.riv',
    riveStateMachine: 'Default',
  },
  {
    title: 'Discord Snowsgiving',
    year: '2022',
    description:
      'I won the Best Digital Art Award at Discords 2022 Snowsgiving event. The prompt was "Draw a Wumpus" (their mascot). thx for the plushies discord <3',
    tools: ['Medibang Paint'],
    imageSrc: '/images/optimized/art/discord.webp',
    imageAlt: 'Discord Snowsgiving',
  },
  {
    title: 'Hearts in Submission',
    year: '2025',
    description: 'Looping motion piece exploring form and color.',
    tools: ['Rive', 'Procreate'],
    videoSrc: '/other/heart.mp4',
    mediaClassName: 'hue-rotate-[-150deg] saturate-',
  },
  {
    title: 'Membership Card',
    year: '2025',
    description:
      'McGill East Asian student society membership card, offering students discounts at various resaturants and cafes throughout Montreal.',
    tools: ['Procreate'],
    imageSrc: '/images/optimized/art/membership-card.webp',
    imageAlt: 'Membership card design',
  },
  {
    title: 'Volume 62, Issue 5',
    year: '2024',
    description: 'High School Newspaper Mag Cover',
    tools: ['Procreate'],
    imageSrc: '/images/optimized/art/bw-graphic.webp',
    imageAlt: 'Volume 62, Issue 5 design',
  },
  {
    title: 'Terminator',
    year: '2023',
    description: 'terminator robot x fire concept that i thought was cool',
    tools: ['Procreate'],
    imageSrc: '/images/optimized/art/terminator.webp',
    imageAlt: 'Terminator design',
  },
  {
    title: 'Wet Reef',
    year: '2024',
    description: 'my fav illustration of all timeee',
    tools: ['Procreate'],
    imageSrc: '/images/optimized/home/footer-image.webp',
    imageAlt: 'Wet Reef',
  },
  {
    title: 'MUS Website',
    year: '2026',
    description: 'a landing page concept for MUS',
    tools: ['Figma', 'Procreate'],
    imageSrc: '/images/optimized/art/mus_website.webp',
    imageAlt: 'MUS Website',
  },
  {
    title: 'Crab Cave',
    year: '2025',
    description: 'just crabs yuh',
    tools: ['Procreate'],
    imageSrc: '/images/optimized/art/Crab_Cave.webp',
    imageAlt: 'Crab Cave',
  },
  {
    title: 'Yinlin',
    year: '2024',
    description: 'A character from gacha game wuthering waves :p',
    tools: ['Procreate'],
    imageSrc: '/images/optimized/art/Yinlin.jpg',
    imageAlt: 'Yinlin',
  },
  {
    title: 'Attack on Titan',
    year: '2024',
    description: 'aot fanart',
    tools: ['Procreate'],
    imageSrc: '/images/optimized/art/aot.webp',
    imageAlt: 'Attack on Titan',
  },
  {
    title: 'The North Pole',
    year: '2024',
    description: 'a bunch of wholesome elves helping santa deliver presents',
    tools: ['Procreate'],
    imageSrc: '/images/optimized/art/north_pole.webp',
    imageAlt: 'The North Pole',
  },
];

const HeaderBar: React.FC<{ onClose?: () => void; showClose?: boolean }> = ({ onClose, showClose }) => (
  <div className="px-3 py-3 min-h-[60px] flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="px-2 py-1 rounded-sm bg-surface-dark-2 text-sm font-mono text-text-inverted-1">Playground</span>
      <div className="flex items-center gap-1">
        <svg width="50" height="14" viewBox="0 0 50 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="14" height="14" fill="#FFC000" />
          <path d="M32 0H18L32 14H18L32 0Z" fill="#27E5EF" />
          <rect x="36" width="14" height="14" rx="7" fill="#B0F2F7" />
        </svg>
      </div>
    </div>
    {onClose && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-dark-2/90 text-xs font-mono text-text-inverted-1 opacity-80 hover:opacity-100 hover:bg-surface-dark-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-opacity transition-colors duration-150 ${showClose ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}
        aria-label="Exit Playground"
      >
        <span className="inline-flex items-center rounded bg-surface-dark-3 px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase text-text-inverted-2/90 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
          Esc
        </span>
        <span className="text-[11px] tracking-wide">Exit</span>
        <X size={14} strokeWidth={2} />
      </button>
    )}
  </div>
);

type PlaygroundPreviewExperienceProps = {
  className?: string;
  cardClassName?: string;
  maxHeight?: string;
  columnsClassName?: string;
  previewContentClassName?: string;
  showHeader?: boolean;
  showBottomFade?: boolean;
  showCursorTooltip?: boolean;
  enterLabel?: string;
};

export const PlaygroundPreviewExperience: React.FC<PlaygroundPreviewExperienceProps> = ({
  className,
  cardClassName,
  maxHeight = 'clamp(520px, 50vw, 820px)',
  columnsClassName = 'columns-2 md:columns-3 gap-x-xs',
  showHeader = true,
  showBottomFade = true,
  showCursorTooltip = true,
  enterLabel = 'Enter Playground',
  previewContentClassName = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedVisible, setExpandedVisible] = useState(false);
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);
  const [isAnimatingExpand, setIsAnimatingExpand] = useState(false);
  const [isClosingExpanded, setIsClosingExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<PlaygroundItem | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [initialInset, setInitialInset] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollYRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const orderedItems = useMemo(() => {
    const orderMap = new Map<string, number>();
    PLAYGROUND_ORDER.forEach((title, index) => orderMap.set(title, index));
    const withIndex = PLAYGROUND_ITEMS.map((item, originalIndex) => ({
      item,
      originalIndex,
      priority: orderMap.has(item.title) ? orderMap.get(item.title)! : Infinity,
    }));
    withIndex.sort((a, b) => (a.priority !== b.priority ? a.priority - b.priority : a.originalIndex - b.originalIndex));
    return withIndex.map(({ item }) => item);
  }, []);

  const openExpanded = useCallback(() => {
    if (!cardRef.current || isExpanded || isAnimatingExpand) return;
    setIsAnimatingExpand(true);
    setIsClosingExpanded(false);
    const rect = cardRef.current.getBoundingClientRect();
    setInitialInset({
      top: rect.top,
      left: rect.left,
      right: window.innerWidth - rect.right,
      bottom: window.innerHeight - rect.bottom,
    });

    const header = document.querySelector('header');
    setHeaderHeight(header?.offsetHeight ?? 0);

    const fullWidth = window.innerWidth;
    const docWidth = document.documentElement.clientWidth;

    scrollYRef.current = window.scrollY;
    document.documentElement.dataset.scrollLocked = scrollYRef.current.toString();
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    if (fullWidth > docWidth) {
      document.body.style.paddingRight = `${fullWidth - docWidth}px`;
    }

    setIsExpanded(true);
    setShowTooltip(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandedVisible(true);
        window.setTimeout(() => {
          setIsFullyExpanded(true);
          setIsAnimatingExpand(false);
        }, 600);
      });
    });
  }, [isExpanded, isAnimatingExpand]);

  const closeExpanded = useCallback(() => {
    if (!isExpanded || isAnimatingExpand) return;
    setIsAnimatingExpand(true);
    setIsClosingExpanded(true);
    requestAnimationFrame(() => {
      if (expandedRef.current) expandedRef.current.scrollTop = 0;
      setExpandedVisible(false);
    });
    closeTimerRef.current = window.setTimeout(() => {
      setIsExpanded(false);
      setIsFullyExpanded(false);
      setIsClosingExpanded(false);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
      delete document.documentElement.dataset.scrollLocked;
      window.scrollTo(0, scrollYRef.current);
      setIsAnimatingExpand(false);
      closeTimerRef.current = null;
    }, 650);
  }, [isExpanded, isAnimatingExpand]);

  const openLightbox = useCallback((item: PlaygroundItem) => {
    setLightboxItem(item);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setLightboxVisible(true));
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxVisible(false);
    setTimeout(() => setLightboxItem(null), 250);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightboxItem) closeLightbox();
      else if (isExpanded) closeExpanded();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [lightboxItem, isExpanded, closeLightbox, closeExpanded]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const renderMedia = useCallback((item: PlaygroundItem) => {
    if (item.riveSrc) {
      return <RiveCard src={item.riveSrc} stateMachine={item.riveStateMachine} />;
    }
    if (item.videoSrc) {
      return <video src={item.videoSrc} autoPlay loop muted playsInline className="w-full h-auto block pointer-events-none" />;
    }
    if (item.imageSrc) {
      return (
        <div className="block w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageSrc} alt={item.imageAlt ?? item.title} className="w-full h-auto block" />
        </div>
      );
    }
    return (
      <div className="w-full min-h-[200px] flex items-center justify-center text-text-muted font-mono text-sm" aria-hidden>
        Image
      </div>
    );
  }, []);

  const insetStyle = expandedVisible
    ? { top: headerHeight, left: 0, right: 0, bottom: 0, borderRadius: 0 }
    : { top: initialInset.top, left: initialInset.left, right: initialInset.right, bottom: initialInset.bottom, borderRadius: 'var(--radius)' };

  return (
    <>
      <div className={className}>
        <div
          ref={cardRef}
          className={`${cardClassName ?? 'bg-surface-dark-1 rounded-lg overflow-hidden cursor-pointer'} ${isExpanded ? 'invisible' : ''}`}
          onClick={openExpanded}
          onMouseEnter={() => showCursorTooltip && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onMouseMove={handleMouseMove}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openExpanded();
            }
          }}
          aria-label={enterLabel}
        >
          {showHeader ? <HeaderBar /> : null}
          <div className={`px-3 overflow-hidden ${previewContentClassName}`.trim()} style={{ maxHeight }}>
            <div className={columnsClassName}>
              {orderedItems.map((item, index) => (
                <div
                  key={`preview-${item.title}-${index}`}
                  className={`break-inside-avoid mb-sm rounded-lg overflow-hidden${item.mediaClassName ? ` ${item.mediaClassName}` : ''}`}
                >
                  {renderMedia(item)}
                </div>
              ))}
            </div>
          </div>
          {showBottomFade ? (
            <div className="pointer-events-none h-[80px] -mt-[80px] relative z-10 bg-gradient-to-t from-surface-dark-1 to-transparent" />
          ) : null}
        </div>
      </div>

      {isMounted && showCursorTooltip && showTooltip && !isExpanded
        ? createPortal(
        <div
          className="fixed z-[85] pointer-events-none px-3 py-1.5 rounded bg-background text-text text-xs font-mono"
          style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}
        >
          {enterLabel}
        </div>
          ,
          document.body
        )
        : null}

      {isMounted && isExpanded
        ? createPortal(
        <div
          ref={expandedRef}
          className="fixed z-[80] bg-surface-dark-1 transition-[top,left,right,bottom,border-radius] duration-[600ms] ease-move motion-reduce:transition-none overflow-y-scroll scrollbar-overlay"
          style={insetStyle}
        >
          <div className="sticky top-0 z-10 bg-surface-dark-1/95 backdrop-blur-sm">
            <div
              className={[
                'overflow-hidden transition-[max-height] duration-[260ms] ease-move',
                isClosingExpanded ? 'max-h-3' : 'max-h-[80px]',
              ].join(' ')}
            >
              <div
                className={[
                  'origin-top transition-all duration-[260ms] ease-move',
                  isClosingExpanded ? 'scale-y-90 -translate-y-1 opacity-0' : 'scale-y-100 translate-y-0 opacity-100',
                ].join(' ')}
              >
                <HeaderBar onClose={closeExpanded} showClose={isFullyExpanded || isClosingExpanded} />
              </div>
            </div>
          </div>
          <div className="px-3 pb-8">
            <div className="columns-2 md:columns-3 gap-x-xs">
              {orderedItems.map((item, index) => (
                <div key={`expanded-${item.title}-${index}`} className="break-inside-avoid mb-sm">
                  <div
                    className={`relative w-full rounded-lg overflow-hidden group cursor-zoom-in${item.mediaClassName ? ` ${item.mediaClassName}` : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => openLightbox(item)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(item)}
                    aria-label={`View ${item.title} full size`}
                  >
                    {renderMedia(item)}
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out motion-reduce:transition-none pointer-events-none">
                      <div className="bg-gradient-to-t from-black/70 to-transparent px-3 pt-8 pb-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-mono text-text-inverted-1">{item.title}</span>
                          <span className="text-sm font-mono text-text-inverted-2 shrink-0">{item.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          ,
          document.body
        )
        : null}

      {isMounted && lightboxItem
        ? createPortal(
        <div
          className={`fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 transition-all duration-250 ease-out motion-reduce:transition-none ${lightboxVisible ? 'bg-overlay-backdrop opacity-100' : 'bg-transparent opacity-0'}`}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${lightboxItem.title}`}
        >
          <div
            className={`relative flex flex-col md:flex-row w-full max-w-[92vw] max-h-[92vh] gap-4 transition-all duration-250 ease-out motion-reduce:transition-none ${lightboxVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 min-w-0 flex items-center justify-center overflow-hidden rounded-lg">
              {lightboxItem.riveSrc ? (
                <RiveCard
                  src={lightboxItem.riveSrc}
                  stateMachine={lightboxItem.riveStateMachine}
                  className="w-full max-h-[80vh] aspect-[4/5] rounded-lg overflow-hidden"
                />
              ) : lightboxItem.videoSrc ? (
                <video
                  src={lightboxItem.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                />
              ) : lightboxItem.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lightboxItem.imageSrc}
                  alt={lightboxItem.imageAlt ?? lightboxItem.title}
                  className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                />
              ) : null}
            </div>
            <div className="md:w-[280px] shrink-0">
              <div className="rounded-lg bg-surface-dark-3 p-3 flex flex-col gap-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="p-2 rounded-lg bg-surface-dark-1 text-text-inverted-1 hover:bg-surface-dark-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline transition-colors"
                    aria-label="Close"
                  >
                    <X size={24} strokeWidth={2} />
                  </button>
                </div>
                <div className="rounded-lg bg-surface-dark-1 px-4 py-4 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-base font-mono text-text-inverted-1">{lightboxItem.title}</span>
                    <span className="text-sm font-mono text-text-inverted-2 shrink-0">{lightboxItem.year}</span>
                  </div>
                  {lightboxItem.description ? (
                    <p className="text-base font-sans text-text-inverted-2 leading-relaxed mb-4">{lightboxItem.description}</p>
                  ) : null}
                  {lightboxItem.tools && lightboxItem.tools.length > 0 ? (
                    <div className="flex flex-col gap-2 pt-1">
                      <span className="text-xs font-mono text-text-inverted-2 uppercase tracking-wider mb-2">Tools used</span>
                      <div className="flex flex-wrap gap-2">
                        {lightboxItem.tools.map((tool) => (
                          <span key={tool} className="px-2 py-1 rounded-sm bg-surface-dark-2 text-xs font-mono text-text-inverted-1">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
          ,
          document.body
        )
        : null}
    </>
  );
};
