/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				purple: '#5832e9',
			},
			keyframes: {
				wiggle: {
					from: { transform: 'translateY(50px)' },
					to: { transform: 'translateY(0px)' },
				},
			},
		},
	},
	plugins: [],
};
