import { COMING_SOON } from '$env/static/private';
import { route } from '$lib/ROUTES';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	if (COMING_SOON === 'true' && url.pathname !== route('/')) redirect(302, route('/'));
};
