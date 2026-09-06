'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { List, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { cn } from '@/src/utils/cn';
import {
  HOME_NAV_MOBILE_ABOUT_IMAGE,
  HOME_NAV_MOBILE_MENU_ENTER_S,
  HOME_NAV_RIGHT_ENTER_EASE,
} from '@/src/components/ui/homeNavbarMotion';

type MobileNavMenuToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  className?: string;
};

export const MobileNavMenuToggle: React.FC<MobileNavMenuToggleProps> = ({
  isOpen,
  onToggle,
  buttonRef,
  className,
}) => {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-menu"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center text-text',
        'transition-colors duration-micro ease-snap',
        'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
        className,
      )}
    >
      {isOpen ? (
        <X size={20} aria-hidden />
      ) : (
        <List size={20} aria-hidden />
      )}
    </button>
  );
};

type MobileNavMenuPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  isAboutPage: boolean;
  panelRef?: React.Ref<HTMLDivElement>;
};

export const MobileNavMenuPanel: React.FC<MobileNavMenuPanelProps> = ({
  isOpen,
  onClose,
  isAboutPage,
  panelRef,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: HOME_NAV_MOBILE_MENU_ENTER_S, ease: HOME_NAV_RIGHT_ENTER_EASE };

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          ref={panelRef}
          id="mobile-nav-menu"
          key="mobile-nav-menu"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={transition}
          className={cn(
            'pointer-events-auto absolute top-full z-0 min-[787px]:hidden',
            'left-[calc(-1*var(--page-margin))] w-[calc(100%+2*var(--page-margin))]',
            'border-b border-border-divider bg-background',
            'px-[var(--page-margin)] pb-[var(--page-margin)] pt-2xs',
          )}
        >
          <div className="flex w-full gap-3">
            <Link
              href="/about"
              prefetch={false}
              onClick={onClose}
              aria-current={isAboutPage ? 'page' : undefined}
              className="group relative aspect-[2/1] w-2/3 min-w-0 overflow-hidden rounded-lg bg-surface-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline"
            >
              <Image
                src={HOME_NAV_MOBILE_ABOUT_IMAGE}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 786px) 66vw, 0px"
                priority={false}
              />
              <div
                className="absolute inset-0 bg-overlay-uniform opacity-100 transition-opacity delay-0 duration-large ease-move group-hover:opacity-50 group-hover:delay-75 group-focus-visible:opacity-50 group-focus-visible:delay-75 motion-reduce:transition-none"
                aria-hidden
              />
              <span className="type-navigation absolute inset-x-0 bottom-0 pb-sm text-center text-footer-console-text">
                About
              </span>
            </Link>

            <div className="aspect-square w-1/3 shrink-0 rounded-lg bg-surface-1 transition-colors delay-0 duration-large ease-move hover:bg-surface-2 hover:delay-75 motion-reduce:transition-none">
              <ThemeToggle className="size-full py-0 hover:opacity-100" />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
