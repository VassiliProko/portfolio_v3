import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			surface: {
  				'1': 'var(--color-surface-1)',
  				'2': 'var(--color-surface-2)',
  				'3': 'var(--color-surface-3)',
  				'dark-1': 'var(--color-surface-dark-1)',
  				'dark-2': 'var(--color-surface-dark-2)'
  			},
  			primary: {
  				darker: 'var(--color-primary-darker)',
  				base: 'var(--color-primary-base)',
  				lighter: 'var(--color-primary-lighter)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			accent: {
  				darker: 'var(--color-accent-darker)',
  				base: 'var(--color-accent-base)',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			text: {
  				DEFAULT: 'var(--color-text)',
  				subtle: 'var(--color-text-subtle',
  				muted: 'var(--color-text-muted)',
  				primary: 'var(--color-text-primary)',
  				'inverted-1': 'var(--color-text-inverted-1)',
  				'inverted-2': 'var(--color-text-inverted-2)'
  			},
  			border: 'hsl(var(--border))',
  			'focus-outline': 'var(--color-focus-outline)',
  			overlay: {
  				backdrop: 'var(--color-overlay-backdrop)',
  				uniform: 'var(--color-overlay-uniform)'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			'ghost-hover': 'var(--color-ghost-hover-bg)',
  			success: 'var(--color-success)',
  			warning: 'var(--color-warning)',
  			error: 'var(--color-error)',
  			info: 'var(--color-info)',
  			foreground: 'hsl(var(--foreground))',
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-satoshi)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-oxygen-mono)',
  				'ui-monospace',
  				'monospace'
  			]
  		},
  		spacing: {
  			'4xs': '3px',
  			'3xs': '5px',
  			'2xs': '8px',
  			xs: '10px',
  			sm: '15px',
  			md: '20px',
  			lg: '30px',
  			xl: '40px',
  			'2xl': '60px',
  			'3xl': '80px',
  			'4xl': '120px'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)'
  		},
  		transitionTimingFunction: {
  			snap: 'cubic-bezier(0,.9,.1,1)',
  			exit: 'cubic-bezier(.4,0,1,1)',
  			move: 'cubic-bezier(.4,0,.2,1)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
