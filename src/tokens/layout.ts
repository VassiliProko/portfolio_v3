/**
 * Layout Tokens
 * Grid, container, and responsive breakpoints
 */

export const layout = {
  pageMargin: {
    mobile: '20px',
    desktop: '32px',
  },
  grid: {
    columns: 12,
    gutter: '15px',
    margin: '20px',
  },
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;
