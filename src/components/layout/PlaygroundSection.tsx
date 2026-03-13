'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export interface PlaygroundItem {
  title: string;
  year: string;
  description?: string;
  tools?: string[];
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
  riveSrc?: string;
  riveStateMachine?: string;
  col?: 0 | 1;
  mediaClassName?: string;
}

const RIVE_BG = 'linear-gradient(180deg, #000000 0%, #1F2638 100%), linear-gradient(180deg, #C5E8F3 0%, #E4E4E4 100%)';

const RiveCard: React.FC<{ src: string; stateMachine?: string; className?: string }> = ({ src, stateMachine, className }) => {
  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine ?? 'Default',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  return (
    <div
      className={className ?? 'w-full aspect-[4/5] max-h-[600px]'}
      style={{ background: RIVE_BG }}
    >
      <RiveComponent />
    </div>
  );
};

const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    title: 'Watching You',
    year: '2025',
    description: 'Interactive Rive animation with eye-tracking state machine.',
    tools: ['Rive', 'Procreate'],
    riveSrc: '/other/landing-graphic.riv',
    riveStateMachine: 'Default',
    col: 0,
  },
  {
    title: 'Discord Snowsgiving',
    year: '2022',
    description: 'I won the Best Digital Art Award at Discords 2022 Snowsgiving event. The prompt was "Draw a Wumpus" (their mascot). thx for the plushies discord <3',
    tools: ['Medibang Paint'],
    imageSrc: '/images/optimized/art/discord.webp',
    imageAlt: 'Discord Snowsgiving',
    col: 1,
  },
  {
    title: 'Hearts in Submission',
    year: '2025',
    description: 'Looping motion piece exploring form and color.',
    tools: ['Rive', 'Procreate'],
    videoSrc: '/other/heart.mp4',
    col: 1,
    mediaClassName: 'hue-rotate-[-150deg] saturate-',
  },
  {
    title: 'Membership Card',
    year: '2025',
    description: 'McGill East Asian student society membership card, offering students discounts at various resaturants and cafes throughout Montreal.',
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
    imageSrc: '/images/optimized/art/yinlin.jpg',
    imageAlt: 'Yinlin',
  },
];

const SECTION_HEIGHT = 'clamp(600px, 60vw, 908px)';

export const PlaygroundSection: React.FC = () => {
  const [lightboxItem, setLightboxItem] = useState<PlaygroundItem | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbSize, setThumbSize] = useState(100);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleContentScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    setAtBottom(scrollTop + clientHeight >= scrollHeight - 2);
    setScrollRatio(maxScroll > 0 ? scrollTop / maxScroll : 0);
    setThumbSize(maxScroll > 0 ? Math.max(20, (clientHeight / scrollHeight) * 100) : 100);

    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 1200);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <>
    <section
      className="w-full py-12 md:py-20 bg-background animate-fade-in-up-fast"
      aria-labelledby="playground-heading"
      id="play"
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="bg-surface-dark-1 rounded-lg overflow-hidden">
          {/* Header bar */}
          <div className="px-3 py-3 flex items-center gap-3">
            <span className="px-2 py-1 rounded-sm bg-surface-dark-2 text-sm font-mono text-text-inverted-1">
              Playground
            </span>
            <div className="flex items-center gap-1">
              <svg width="50" height="14" viewBox="0 0 50 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="14" height="14" fill="#FFC000"/>
                <path d="M32 0H18L32 14H18L32 0Z" fill="#27E5EF"/>
                <rect x="36" width="14" height="14" rx="7" fill="#B0F2F7"/>
              </svg>
            </div>
          </div>

          {/* Scrollable image grid */}
          <div className="relative">
          <div
            ref={contentRef}
            className="px-3 overflow-y-auto scrollbar-hide"
            style={{ maxHeight: SECTION_HEIGHT }}
            onScroll={handleContentScroll}
          >
            <div className="flex flex-col md:flex-row gap-sm pb-3">
              {(() => {
                const columns: [PlaygroundItem[], PlaygroundItem[]] = [[], []];
                let autoIndex = 0;
                for (const item of PLAYGROUND_ITEMS) {
                  if (item.col !== undefined) {
                    columns[item.col].push(item);
                  } else {
                    columns[autoIndex % 2].push(item);
                    autoIndex++;
                  }
                }
                return columns;
              })().map((colItems, col) => (
                <div key={col} className="flex flex-col gap-sm flex-1 min-w-0">
                  {colItems.map((item, index) => (
                    <article
                      key={`${item.title}-${item.year}-${index}`}
                      className="flex flex-col"
                    >
                  <div
                    className={`relative w-full rounded-lg overflow-hidden group cursor-zoom-in${item.mediaClassName ? ` ${item.mediaClassName}` : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxItem(item)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setLightboxItem(item)}
                    aria-label={`View ${item.title} full size`}
                  >
                    {item.riveSrc ? (
                      <RiveCard src={item.riveSrc} stateMachine={item.riveStateMachine} />
                    ) : item.videoSrc ? (
                      <video
                        src={item.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto block pointer-events-none"
                      />
                    ) : item.imageSrc ? (
                      <div className="block w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt ?? item.title}
                          className="w-full h-auto block"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full min-h-[200px] flex items-center justify-center text-text-muted font-mono text-sm"
                        aria-hidden
                      >
                        Image
                      </div>
                    )}

                    {/* Hover details overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out motion-reduce:transition-none pointer-events-none">
                      <div className="bg-gradient-to-t from-black/70 to-transparent px-3 pt-8 pb-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-mono text-text-inverted-1">{item.title}</span>
                          <span className="text-sm font-mono text-text-inverted-2 shrink-0">{item.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator track */}
          <div
            className={`absolute right-1 top-0 bottom-0 w-[4px] rounded-full transition-opacity duration-300 ${isScrolling ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden
          >
            <div
              className="absolute w-full rounded-full bg-white/30"
              style={{
                height: `${thumbSize}%`,
                top: `${scrollRatio * (100 - thumbSize)}%`,
              }}
            />
          </div>
          </div>

          {/* Bottom fade gradient — hidden once scrolled to end */}
          <div
            className={`pointer-events-none h-[80px] -mt-[80px] relative z-10 bg-gradient-to-t from-surface-dark-1 to-transparent transition-opacity duration-300 ${atBottom ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>
      </div>
    </section>

    {/* Lightbox */}
    {lightboxItem && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4 md:p-8"
        onClick={closeLightbox}
        role="dialog"
        aria-modal="true"
        aria-label={`Viewing ${lightboxItem.title}`}
      >
        <div
          className="relative flex flex-col md:flex-row w-full max-w-[92vw] max-h-[92vh] gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media */}
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

          {/* Details panel */}
          <div className="md:w-[280px] shrink-0 flex flex-col gap-3">
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
              {lightboxItem.description && (
                <p className="text-base font-sans text-text-inverted-2 leading-relaxed mb-4">
                  {lightboxItem.description}
                </p>
              )}
              {lightboxItem.tools && lightboxItem.tools.length > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-xs font-mono text-text-inverted-2 uppercase tracking-wider mb-2">Tools used</span>
                  <div className="flex flex-wrap gap-2">
                    {lightboxItem.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 rounded-sm bg-surface-dark-2 text-xs font-mono text-text-inverted-1"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
