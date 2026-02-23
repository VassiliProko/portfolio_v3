/**
 * Motion Tokens
 * Timing and easing for all animations and transitions
 */

export const motion = {
  timing: {
    micro: '60ms',
    base: '120ms',
    medium: '180ms',
    large: '300ms',
  },
  easing: {
    enter: 'cubic-bezier(0,.9,.1,1)',
    exit: 'cubic-bezier(.4,0,1,1)',
    move: 'cubic-bezier(.4,0,.2,1)',
    micro: 'cubic-bezier(0,.9,.1,1)',
  },
  exitDurations: {
    press: '36ms',
    dropdown: '72ms',
    modal: '108ms',
    toast: '60ms',
  },
  stagger: {
    delay: '15ms',
  },
} as const;
