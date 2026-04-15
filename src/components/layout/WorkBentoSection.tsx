'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

type WorkBentoItemProps = {
  title: string;
  size?: 'large' | 'small' | 'playground';
  hoverTitle?: string;
  hoverYear?: string;
};

const HoverMetaPills: React.FC<{ title?: string; year?: string }> = ({ title = 'Project', year = '2026' }) => {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-between px-3">
      <div
        className={[
          'rounded-sm bg-surface-1 px-3 py-2 font-sans text-sm leading-none text-text',
          'translate-y-3 opacity-0 transition-all duration-[260ms] ease-move',
          'group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
          'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        ].join(' ')}
      >
        {title}
      </div>
      <div
        className={[
          'rounded-sm bg-surface-1 px-3 py-2 font-sans text-sm leading-none text-text',
          'translate-y-3 opacity-0 transition-all duration-[260ms] ease-move',
          'group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
          'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        ].join(' ')}
      >
        {year}
      </div>
    </div>
  );
};

const WorkBentoItem: React.FC<WorkBentoItemProps> = ({
  title,
  size = 'small',
  hoverTitle = 'Project',
  hoverYear = '2026',
}) => {
  const isPlayground = size === 'playground';
  const isLarge = size === 'large';
  const isSecondSmallCaseCard = title === 'Case Study Small 02';
  const spanClass = isPlayground ? 'col-span-full md:col-span-2 lg:col-span-3' : isLarge ? 'md:col-span-2 lg:col-span-2' : 'lg:col-span-1';

  return (
    <article
      className={[
        'group relative overflow-hidden rounded-lg border border-border-base bg-surface-dark-1 p-sm',
        'flex items-end',
        spanClass,
        isPlayground ? 'col-span-full min-h-[520px]' : 'min-h-[450px]',
      ].join(' ')}
      style={isSecondSmallCaseCard ? { background: 'var(--gradient-usthing-app)' } : undefined}
      aria-label={`${title} placeholder`}
    >
      <span className="sr-only">{title}</span>
      {isSecondSmallCaseCard ? (
        <div className="absolute inset-x-0 top-0 flex items-start justify-center overflow-hidden pt-3">
          <div className="relative w-[clamp(266px,95vw,302px)] aspect-[281/584]">
            <div className="absolute left-[7.1%] right-[7.1%] top-[6.6%] bottom-[6.7%] overflow-hidden rounded-[34px]">
              <iframe
                className="pointer-events-none absolute -left-[43%] top-0 h-full w-[186%]"
                src="https://www.youtube.com/embed/kAJ7SuiSfWk?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=kAJ7SuiSfWk"
                title="Grade Distribution mobile app preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <Image
              src="/images/optimized/Other/iphone_case.webp"
              alt=""
              fill
              className="pointer-events-none select-none object-contain scale-[0.92] origin-top translate-y-[29px]"
              sizes="(max-width: 768px) 95vw, 302px"
              priority={false}
            />
          </div>
        </div>
      ) : null}
      <HoverMetaPills title={hoverTitle} year={hoverYear} />
    </article>
  );
};

const McssFeaturedCaseStudy: React.FC = () => {
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [showCursorTooltip, setShowCursorTooltip] = React.useState(false);

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <>
      <Link
        href="/mcss"
        className={[
          'group relative overflow-hidden md:col-span-2 lg:col-span-2 min-h-[280px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[450px] rounded-lg border border-border-base p-sm',
          'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
        ].join(' ')}
        style={{ background: 'var(--gradient-mcss)' }}
        aria-label="Open MCSS case study"
        onMouseEnter={() => setShowCursorTooltip(true)}
        onMouseLeave={() => setShowCursorTooltip(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="h-full w-full rounded-lg overflow-hidden p-3 md:p-5 flex items-center justify-center">
          <div className="w-full max-w-[780px] aspect-video rounded-lg overflow-hidden">
            <iframe
              className="h-full w-full pointer-events-none"
              src="https://www.youtube.com/embed/WBKNriQ3Jew?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=WBKNriQ3Jew"
              title="MCSS featured case study video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
        <HoverMetaPills title="McGill Chinese Students' Society" year="Website" />
      </Link>

      {showCursorTooltip && (
        <div
          className="fixed z-[60] pointer-events-none rounded-sm bg-surface-dark-1 px-3 py-1.5 font-sans text-xs text-text-inverted-1"
          style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}
        >
          View Case Study
        </div>
      )}
    </>
  );
};

export const WorkBentoSection: React.FC = () => {
  return (
    <section
      className="w-full py-12 md:py-20 bg-background animate-fade-in-up-fast"
      aria-labelledby="work-bento-heading"
      id="work"
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <h2
          id="work-bento-heading"
          className="text-text font-sans font-medium text-2xl md:text-3xl mb-8 md:mb-10"
        >
          Selected Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <McssFeaturedCaseStudy />
          <WorkBentoItem title="Case Study Small 02" size="small" hoverTitle="USThing" hoverYear="App Feature" />
          <WorkBentoItem title="Case Study Small 01" size="small" />

          <WorkBentoItem title="Case Study Large 02" size="large" />

          <WorkBentoItem title="Playground" size="playground" />
        </div>
      </div>
    </section>
  );
};
