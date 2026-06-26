'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useHomeEnterAnimation } from '@/src/contexts/HomeEnterAnimationContext';
import {
  HOME_MAIN_CONTENT_ENTER_S,
  HOME_NAV_ENTER_EASE,
} from '@/src/components/ui/homeNavbarMotion';

type MainContentShellProps = {
  children: React.ReactNode;
};

export const MainContentShell: React.FC<MainContentShellProps> = ({ children }) => {
  const { mainContentVisible } = useHomeEnterAnimation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.main
      className="flex-1 w-full"
      initial={false}
      animate={{
        opacity: mainContentVisible ? 1 : 0,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : HOME_MAIN_CONTENT_ENTER_S,
        ease: HOME_NAV_ENTER_EASE,
      }}
      style={{ pointerEvents: mainContentVisible ? 'auto' : 'none' }}
      aria-hidden={!mainContentVisible}
    >
      {children}
    </motion.main>
  );
};
