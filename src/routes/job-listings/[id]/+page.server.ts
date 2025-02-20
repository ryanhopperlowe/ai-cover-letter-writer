import { getPdfTextContent } from '$lib/helpers/pdf';
import { route } from '$lib/ROUTES';
import { db } from '$lib/server/db';
import { CoverLetters } from '$lib/server/db/schema/cover-letters';
import { JobListings } from '$lib/server/db/schema/job-listings';
import { Resumes, ResumesSchema } from '$lib/server/db/schema/resumes';
import { AiService } from '$lib/server/openai';
import { StorageClient } from '$lib/server/storage/storage-client.server';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		redirect(302, route('/login'));
	}

	const { id } = params;

	const [listing] = await db.select().from(JobListings).where(eq(JobListings.id, id));

	const resumes = await db.select().from(Resumes).where(eq(Resumes.userId, locals.user.id));

	if (!listing) redirect(302, route('/job-listings'));

	return { listing, resumes };
};

export const actions = {
	createCoverLetter: async ({ locals, params, request }) => {
		const { user } = locals;
		if (!user) {
			redirect(302, route('/login'));
		}

		const { id: jobListing } = params;

		if (!jobListing) {
			return fail(400, { errors: { form: ['Invalid id'] } });
		}

		const [listing] = await db.select().from(JobListings).where(eq(JobListings.id, jobListing));

		if (!listing) {
			return fail(404, { errors: { form: ['Listing not found'] } });
		}

		const formData = await request.formData();

		const resumeIds = ResumesSchema.select.shape.id.array().parse(formData.getAll('resumeIds'));

		if (!resumeIds.length) {
			return fail(400, { errors: { form: ['No resumes selected'] } });
		}

		const resumes = await db.select().from(Resumes).where(inArray(Resumes.id, resumeIds));

		if (!resumes.length) {
			return fail(400, { errors: { form: ['No resumes selected'] } });
		}

		const objects = await Promise.all(
			resumes.map((resume) => StorageClient.getObject(user.id, resume.bucketPath))
		);

		const textContent = (
			await Promise.all(
				objects.map(async (obj) => {
					const buffer = await obj.Body?.transformToByteArray();

					if (!buffer) {
						return null;
					}

					return getPdfTextContent(buffer.buffer as ArrayBuffer);
				})
			)
		).filter((x) => x !== null);

		const coverLetterContent = await AiService.generateCoverLetter(listing.content, textContent);

		if (coverLetterContent.content === null) {
			return fail(500, { errors: { form: ['Failed to generate cover letter'] } });
		}

		await db.insert(CoverLetters).values({
			content: coverLetterContent.content,
			userId: user.id,
			jobListing
		});
	}
} satisfies Actions;
