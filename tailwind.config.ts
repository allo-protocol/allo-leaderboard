import type { Config } from "tailwindcss";
const { withTV } = require("tailwind-variants/transformer");
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			founders: ["var(--font-founders)", ...defaultTheme.fontFamily.sans],
  			mono: ["var(--font-dm-mono)", ...defaultTheme.fontFamily.mono]
  		},
  		backgroundImage: {
  			"footer-gradient-bg": "url('/footer-gradient-bg.png')",
  			"allo-bg": "url('/allo-bg.svg')",
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		colors: {
  			green: {
  				'500': '#185B52',
  				'700': '#00433B'
  			},
  			blue: {
  				'200': '#9EDCFF',
  				'600': '#191AFE',
  				'800': '#082553'
  			},
  			yellow: {
  				'200': '#F8FFA9',
  				'500': '#F0FF40'
  			},
  			grey: {
  				'100': '#EBEBEB',
  				'200': '#CACBCB',
  				'400': '#979998'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
