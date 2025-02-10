import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

export default defineConfig({
	plugins: [sveltekit(), kitRoutes()],

	server: {
		fs: {
			allow: ['static']
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
