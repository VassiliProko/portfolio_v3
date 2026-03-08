'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/src/utils/cn';

const HOVER_IMAGE_WIDTH = 280;
const HOVER_IMAGE_HALF = HOVER_IMAGE_WIDTH / 2;
const EDGE_MARGIN_RATIO = 0.3; // image center stays between 30% and 70% of row width

export interface ExperienceEducationItemProps {
  title: string;
  subtitle: string;
  date: string;
  href?: string;
  /** Optional image URL; renders a black placeholder when omitted */
  imageSrc?: string;
  tone?: 'experience' | 'education';
  className?: string;
}

export const ExperienceEducationItem: React.FC<ExperienceEducationItemProps> = ({
  title,
  subtitle,
  date,
  href = '#',
  imageSrc,
  tone = 'experience',
  className,
}) => {
  const [expanded, setExpanded] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverImageX, setHoverImageX] = useState<number | null>(null);
  const hasMovedRef = useRef(false);

  const clampCenter = useCallback((clientX: number) => {
    const row = rowRef.current;
    if (!row) return 0;
    const rect = row.getBoundingClientRect();
    const cursorX = clientX - rect.left;
    const w = rect.width;
    const minCenter = Math.max(HOVER_IMAGE_HALF, EDGE_MARGIN_RATIO * w);
    const maxCenter = Math.min(w - HOVER_IMAGE_HALF, (1 - EDGE_MARGIN_RATIO) * w);
    return Math.min(Math.max(cursorX, minCenter), maxCenter);
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      hasMovedRef.current = false;
      const nextX = clampCenter(e.clientX);
      const el = imageRef.current;
      if (el) {
        el.style.transition = 'none';
        el.style.left = `${nextX}px`;
      }
      setHoverImageX(nextX);
      setIsHovering(true);
    },
    [clampCenter]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      const el = imageRef.current;
      if (!el) return;
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        el.style.transition = 'left 200ms ease-out';
      }
      const nextX = clampCenter(e.clientX);
      el.style.left = `${nextX}px`;
      setHoverImageX(nextX);
    },
    [clampCenter]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    hasMovedRef.current = false;
    setHoverImageX(null);
  }, []);

  const imageContent = imageSrc ? (
    <img src={imageSrc} alt="" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-surface-dark-1" />
  );
  const isActive = isHovering || expanded;
  const barClassName =
    tone === 'experience'
      ? isActive
        ? 'bg-primary-base'
        : 'bg-primary-darker'
      : isActive
        ? 'bg-accent-base'
        : 'bg-accent-darker';

  return (
    <li
      ref={rowRef}
      className={cn(
        'group relative border-b border-border-divider last:border-b-0 transition-colors duration-[60ms] ease-snap md:hover:bg-surface-2',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0 left-0 w-4xs transition-colors duration-[60ms] ease-snap',
          barClassName
        )}
      />
      <div
        className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0 px-xs py-2xs cursor-pointer md:cursor-default"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex flex-wrap items-baseline gap-x-0 gap-y-0">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-medium text-text hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline rounded-sm transition-all duration-[60ms] ease-snap"
            onClick={(e) => e.stopPropagation()}
          >
            {title}&nbsp;
          </Link>
          <span className="font-sans text-text-muted"> / {subtitle}</span>
        </div>
        <span className="font-sans text-text-subtle shrink-0">{date}</span>
      </div>

      {/* Hover image — desktop only, only mounts when cursor position exists */}
      {isHovering && hoverImageX !== null && (
        <div
          ref={imageRef}
          className="hidden md:block absolute top-1/2 z-10 pointer-events-none"
          style={{
            left: `${hoverImageX}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-[280px] aspect-[5/3] rounded-sm overflow-hidden border border-border-base">
            {imageContent}
          </div>
        </div>
      )}

      {/* Mobile expanded image */}
      <div
        className={cn(
          'md:hidden grid transition-[grid-template-rows] duration-[350ms] ease-move',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden min-h-0">
          <div className="px-xs pb-xs">
            <div className="w-full aspect-[5/3] rounded-sm overflow-hidden">
              {imageContent}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
