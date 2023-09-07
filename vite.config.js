import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), cssInjectedByJsPlugin()],
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `assets/w-imgr.js`,
			},
		},
	},
	css: {
		postcss: {
			plugins: [tailwindcss],
		},
		build: {
			cssCodeSplit: false,
		},
	},
});
