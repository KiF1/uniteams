/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: '#0050A4',
  			black: '#262F2F',
  			gray: {
  				'50': '#D9D9D9',
  				'100': '#262626',
  				'150': '#141417',
  				'160': '#4F4E59',
  				'170': '#8F9098',
  				'200': '#A7AAB9',
  				'300': '#9EA6B8',
  				'350': '#7D849A',
  				'400': '#56585B',
  				'500': '#525252',
  				'600': '#F5F7F9',
					'700': '#EEF1F3',
  				'800': '#CCCDD2'
  			},
  			white: '#FFFFFF',
  			red: {
  				'100': '#E5172F',
  				'200': '#E77A87',
  				'300': '#ce1516',
  				'400': '#FCF2F2',
  				'500': '#E5172F',
  				'700': '#b91c1c'
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
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
    plugins: [require("tailwindcss-animate")]
}

