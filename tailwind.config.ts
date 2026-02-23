import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic colors from CSS variables - use these, never arbitrary hex */
        background: 'var(--color-background)',
        surface: {
          1: 'var(--color-surface-1)',
          2: 'var(--color-surface-2)',
          3: 'var(--color-surface-3)',
          'dark-1': 'var(--color-surface-dark-1)',
          'dark-2': 'var(--color-surface-dark-2)',
        },
        primary: {
          darker: 'var(--color-primary-darker)',
          base: 'var(--color-primary-base)',
          lighter: 'var(--color-primary-lighter)',
        },
        accent: {
          darker: 'var(--color-accent-darker)',
          base: 'var(--color-accent-base)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          subtle: 'var(--color-text-subtle',
          muted: 'var(--color-text-muted)',
          primary: 'var(--color-text-primary)',
          'inverted-1': 'var(--color-text-inverted-1)',
          'inverted-2': 'var(--color-text-inverted-2)',
        },
        border: {
          base: 'var(--color-border-base)',
          divider: 'var(--color-border-divider)',
          hover: 'var(--color-border-hover)',
          focus: 'var(--color-border-focus)',
        },
        'focus-outline': 'var(--color-focus-outline)',
        overlay: {
          backdrop: 'var(--color-overlay-backdrop)',
          uniform: 'var(--color-overlay-uniform)',
        },
        card: 'var(--color-card-bg)',
        'ghost-hover': 'var(--color-ghost-hover-bg)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-oxygen-mono)', 'ui-monospace', 'monospace'],
      },
      spacing: {
        '4xs': '3px',
        '3xs': '5px',
        '2xs': '8px',
        'xs': '10px',
        'sm': '15px',
        'md': '20px',
        'lg': '30px',
        'xl': '40px',
        '2xl': '60px',
        '3xl': '80px',
        '4xl': '120px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
      },
      transitionTimingFunction: {
        'snap': 'cubic-bezier(0,.9,.1,1)',
        'exit': 'cubic-bezier(.4,0,1,1)',
        'move': 'cubic-bezier(.4,0,.2,1)',
      },
    },
  },
  plugins: [],
}
export default config
