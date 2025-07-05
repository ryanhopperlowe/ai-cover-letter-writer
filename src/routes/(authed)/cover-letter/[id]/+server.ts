import { route } from '$lib/ROUTES';
import { getCoverLetterPdf } from '$lib/server/functions/resume-functions';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) redirect(302, route('/login'));

	const { id } = params;

	const [error, pdf] = await getCoverLetterPdf(locals.user, id);

	if (error) return new Response(error.message, { status: error.status });

	return new Response(pdf, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="cover-letter-${id}.pdf"`
		}
	});
};
