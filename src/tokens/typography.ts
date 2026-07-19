/**
 * Typography Tokens
 * Source: Figma Portfolio-v4 / typography (309:476)
 * Properties only: family, size, weight, tracking. Color is applied separately.
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
  /**
   * Semantic type scale — tracking is % of font-size (Figma letterSpacing: 8 → 0.08em).
   * Navbar name is intentionally excluded (unique brand style).
   */
  styles: {
    title: {
      fontFamily: 'sans',
      fontSize: '32px',
      fontWeight: 500,
      letterSpacing: '0',
    },
    subtitle: {
      fontFamily: 'sans',
      fontSize: '20px',
      fontWeight: 500,
      letterSpacing: '0',
    },
    navigation: {
      fontFamily: 'mono',
      fontSize: '16px',
      fontWeight: 400,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    'navigation-sm': {
      fontFamily: 'mono',
      fontSize: '14px',
      fontWeight: 400,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    label: {
      fontFamily: 'mono',
      fontSize: '14px',
      fontWeight: 400,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    paragraph: {
      fontFamily: 'sans',
      fontSize: '16px',
      fontWeight: 500,
      letterSpacing: '0',
    },
    'paragraph-mono': {
      fontFamily: 'mono',
      fontSize: '16px',
      fontWeight: 400,
      letterSpacing: '0',
    },
  },
} as const;
