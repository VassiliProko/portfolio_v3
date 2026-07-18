/**
 * Typography Tokens
 */

export const typography = {
  fontFamily: {
    sans: '"Satoshi Variable", system-ui, sans-serif',
    mono: '"Oxygen Mono", ui-monospace, monospace',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  /** Default body paragraph — Satoshi medium, text color */
  paragraph: {
    fontFamily: 'sans',
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    color: 'text',
  },
} as const;
