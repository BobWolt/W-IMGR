import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		cssInjectedByJsPlugin({ topExecutionPriority: false }),
	],
	css: {
		postcss: {
			plugins: [tailwindcss],
		},
	},
});
