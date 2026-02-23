/**
 * Color Tokens
 * Single source of truth for all color values in the design system
 */

export const colors = {
  // Primary Color
  primary: {
    darker: '#207F85',
    base: '#27E5EF',
    lighter: '#B0F2F7',
  },

  // Accent Color
  accent: {
    darker: '#695312',
    base: '#FFC000',
  },

  // Neutral Colors (Zinc palette)
  neutral: {
    background: '#fafafa', // zinc-50
    'surface-1': '#f4f4f5', // zinc-100
    'surface-2': '#e4e4e7', // zinc-200
    'surface-3': '#d4d4d8', // zinc-300
    'surface-dark-1': '#18181b', // zinc-900
    'surface-dark-2': '#27272a', // zinc-800
    text: '#18181b', // zinc-900
    'text-subtle': '#3F3F47', // zinc-700
    'text-muted': '#71717a', // zinc-500
    'text-primary': '#27E5EF',
    'text-inverted-1': '#fafafa', // zinc-50
    'text-inverted-2': '#d4d4d8', // zinc-300
  },

  // Semantic Colors
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Interactive State Colors
  interactive: {
    'primary-hover': '#207F85',
    'primary-active': '#207F85',
    'ghost-hover-bg': 'rgba(39, 229, 239, 0.08)',
    'disabled-opacity': 0.4,
  },

  // Focus Indicator
  focus: {
    outline: '#206cdf',
    'input-border': '#D94030',
    'input-ring': 'rgba(217, 64, 48, 0.2)',
  },

  // Overlay & Effects
  overlay: {
    backdrop: 'rgba(0, 0, 0, 0.6)',
    uniform: 'rgba(0, 0, 0, 0.35)',
  },

  // Border Colors (pre-computed)
  border: {
    base: 'rgba(0, 0, 0, 0.12)',
    divider: 'rgba(0, 0, 0, 0.06)',
    hover: 'rgba(0, 0, 0, 0.18)',
    focus: 'rgba(0, 0, 0, 0.24)',
  },
} as const;
