import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { route } from '$lib/ROUTES';
import { NODE_ENV } from '$env/static/private';

export const load: PageServerLoad = async () => {
	if (NODE_ENV !== 'production') redirect(302, route('/resumes'));
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	}
};
