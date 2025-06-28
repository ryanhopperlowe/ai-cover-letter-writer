import { route } from '$lib/ROUTES';
import { db } from '$lib/server/db';
import { CoverLetters, CoverLettersSchema } from '$lib/server/db/schema/cover-letters';
import { JobListings } from '$lib/server/db/schema/job-listings';
import { Resumes, ResumesSchema } from '$lib/server/db/schema/resumes';
import { CoverLetterService } from '$lib/server/functions/cover-letter-functions';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		redirect(302, route('/login'));
	}

	const { id } = params;

	const [listing] = await db.select().from(JobListings).where(eq(JobListings.id, id));

	const resumes = await db.select().from(Resumes).where(eq(Resumes.userId, locals.user.id));

	if (!listing) redirect(302, route('/job-listings'));

	const coverLetters = await db.select().from(CoverLetters).where(eq(CoverLetters.jobListing, id));

	return { listing, resumes, coverLetters };
};

export const actions: Actions = {
	createCoverLetter: async ({ locals, params, request }) => {
		const { user } = locals;
		if (!user) redirect(302, route('/login'));

		const formData = await request.formData();
		const resumeIds = ResumesSchema.select.shape.id.array().parse(formData.getAll('resumeIds'));

		const [error] = await CoverLetterService.generateCoverLetter(user, params.id, resumeIds);

		if (error) return fail(error.status, { errors: { form: [error.message] } });
	},
	deleteCoverLetter: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(302, route('/login'));
		}

		const errors = <T extends object>(errors: T) => {
			return {
				action: 'deleteCoverLetter' as const,
				errors
			};
		};

		const formData = Object.fromEntries(await request.formData());
		const { data, success } = CoverLettersSchema.select.pick({ id: true }).safeParse(formData);

		if (!success) {
			return fail(400, errors({ form: ['Invalid Cover letter ID'] }));
		}

		const { id } = data;

		const [coverLetter] = await db.select().from(CoverLetters).where(eq(CoverLetters.id, id));

		if (!coverLetter) {
			return fail(404, errors({ form: ['Cover letter not found'] }));
		}

		await db.delete(CoverLetters).where(eq(CoverLetters.id, id));
	}
};
