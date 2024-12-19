/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {},
  		fontSize: {
  			'heading-xl': '82px',
  			'heading-lg': '75px',
  			'heading-01': '65px',
  			'heading-02': '50px',
  			'heading-03': '40px',
  			'heading-04': '30px',
  			'heading-05': '24px',
  			'heading-06': '20px',
  			paragraph: '18px',
  			xs: '12px',
  			sm: '14px',
  			base: '16px',
  			lg: '18px',
  			xl: '20px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			surface: {
  				'100': '#FFFFFF',
  				'200': '#D6D6D6',
  				'300': '#B3B3B3',
  				'400': '#8F8F8F',
  				'500': '#6B6B6B',
  				'600': '#474747',
  				'700': '#242424',
  				'800': '#000000'
  			},
  			primary: {
  				'100': '#E0DDDB',
  				'200': '#ADA69F',
  				'300': '#A09890',
  				'400': '#897F75',
  				dark: '#615851',
  				darker: '#4E4641',
  				DEFAULT: '#897F75'
  			},
  			secondary: {
  				'100': '#C0C6CF',
  				'200': '#4C5B76',
  				'300': '#273A5A',
  				'400': '#0A1F44'
  			},
  			accent: {
  				'100': '#D9E0DE',
  				'200': '#567E91',
  				'300': '#7F9891',
  				'400': '#53798C'
  			},
  			success: '#6BAA75',
  			error: '#C85A5A',
  			warning: '#E8A865',
  			info: '#4A8095',
  			disabled: '#B3B3B3',
  			focus: '#D4A01E',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
