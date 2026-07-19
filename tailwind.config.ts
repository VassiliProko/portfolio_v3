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
  			background: 'var(--color-background)',
  			surface: {
  				'1': 'var(--color-surface-1)',
  				'2': 'var(--color-surface-2)',
  				'3': 'var(--color-surface-3)',
  				'dark-1': 'var(--color-surface-dark-1)',
  				'dark-2': 'var(--color-surface-dark-2)',
  				'dark-4': 'var(--color-surface-dark-4)',
				'dark-3': 'var(--color-surface-dark-3)'
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
  				subtle: 'var(--color-text-subtle)',
  				muted: 'var(--color-text-muted)',
  				primary: 'var(--color-text-primary)',
  				'inverted-1': 'var(--color-text-inverted-1)',
  				'inverted-2': 'var(--color-text-inverted-2)'
  			},
  			border: {
  				DEFAULT: 'hsl(var(--border))',
  				base: 'var(--color-border-base)',
  				divider: 'var(--color-border-divider)',
  				hover: 'var(--color-border-hover)',
  				focus: 'var(--color-border-focus)',
  			},
  			'focus-outline': 'var(--color-focus-outline)',
  			overlay: {
  				backdrop: 'var(--color-overlay-backdrop)',
  				uniform: 'var(--color-overlay-uniform)'
  			},
  			'navbar-dropdown': 'var(--color-navbar-dropdown-bg)',
  			'case-study-header-btn': 'var(--color-case-study-header-btn-bg)',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			'ghost-hover': 'var(--color-ghost-hover-bg)',
  			success: 'var(--color-success)',
  			warning: 'var(--color-warning)',
  			error: 'var(--color-error)',
  			info: 'var(--color-info)',
  			footer: {
  				'console-text': 'var(--color-footer-console-text)',
  				'last-updated': 'var(--color-footer-last-updated)',
  				'contact-bg': 'var(--color-footer-contact-bg)',
  				'contact-bg-hover': 'var(--color-footer-contact-bg-hover)',
  			},
  			intro: {
  				munching: 'var(--color-intro-munching)',
  				cooking: 'var(--color-intro-cooking)',
  				subtitle: 'var(--color-intro-subtitle)',
  				'highlight-rest': 'var(--color-intro-highlight-rest)',
  				'munching-highlight': 'var(--color-intro-munching-highlight)',
  				'cooking-highlight': 'var(--color-intro-cooking-highlight)',
  			},
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
  			],
  			display: [
  				'var(--font-satisfy)',
  				'cursive'
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
			'about-role-icon': 'var(--spacing-about-role-icon)',
			'about-role-section': 'var(--spacing-about-role-section)',
			'showcase-illustration': 'var(--spacing-showcase-illustration)',
			'showcase-illustration-sm': 'var(--spacing-showcase-illustration-sm)',
			xl: '40px',
  			'2xl': '60px',
  			'3xl': '80px',
  			'4xl': '120px'
  		},
  		maxWidth: {
  			page: 'var(--page-max-width)',
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			'image-preview': 'var(--radius-image-preview)',
  		},
  		transitionTimingFunction: {
  			snap: 'cubic-bezier(0,.9,.1,1)',
  			exit: 'cubic-bezier(.4,0,1,1)',
  			move: 'cubic-bezier(.4,0,.2,1)'
  		},
  		boxShadow: {
  			'highlight-reel-inset': 'var(--shadow-highlight-reel-inset)',
  			'highlight-reel-video-outer': 'var(--shadow-highlight-reel-video-outer)',
  			'about-profile-stamp': 'var(--shadow-about-profile-stamp)',
  			'prettify-minerva-showcase-frame': 'var(--shadow-prettify-minerva-showcase-frame)',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
