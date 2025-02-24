import { NODE_ENV } from '$env/static/private';
import { route } from '$lib/ROUTES';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	if (NODE_ENV === 'production' && url.pathname !== route('/')) redirect(302, route('/'));
};
