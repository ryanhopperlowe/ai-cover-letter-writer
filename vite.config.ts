import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import type { KIT_ROUTES } from '$lib/ROUTES';

export default defineConfig({
	plugins: [sveltekit(), kitRoutes<KIT_ROUTES>()],

	server: {
		fs: {
			allow: ['static']
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
