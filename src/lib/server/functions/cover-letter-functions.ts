import { getPdfTextContent } from '$lib/helpers/pdf';
import { db } from '$lib/server/db';
import { CoverLetters } from '$lib/server/db/schema/cover-letters';
import { JobListings } from '$lib/server/db/schema/job-listings';
import { Resumes } from '$lib/server/db/schema/resumes';
import {
	attemptApi,
	BadRequestError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError
} from '$lib/server/error';
import { AiService } from '$lib/server/openai';
import { StorageClient } from '$lib/server/storage/storage-client.server';
import { eq, inArray } from 'drizzle-orm';
import { decrement } from '$lib/server/db/helpers';
import { Users, type UserUI } from '$lib/server/db/schema/users';

const generateCoverLetter = attemptApi.create(
	async (user: UserUI, listingId: string, resumeIds: string[]) => {
		if (!user.tokens) {
			throw new BadRequestError('No tokens to generate cover letter');
		}

		if (!listingId) {
			throw new BadRequestError('Invalid Job Listing Id');
		}

		return await db.transaction(async (tx) => {
			await tx
				.update(Users)
				.set({ tokens: decrement(Users.tokens, 1) })
				.where(eq(Users.id, user.id))
				.execute();

			const [listing] = await tx.select().from(JobListings).where(eq(JobListings.id, listingId));

			if (!listing) {
				throw new NotFoundError('Job listing not found');
			}

			if (!resumeIds.length) {
				throw new BadRequestError('No resumes selected');
			}

			const resumes = await tx.select().from(Resumes).where(inArray(Resumes.id, resumeIds));

			if (!resumes.length) {
				throw new BadRequestError('No resumes selected');
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

			const { content, companyName, hiringManager, mission, title: jobTitle, address } = listing;

			const coverLetterContent = await AiService.generateCoverLetter(
				content,
				textContent,
				JSON.stringify({ companyName, hiringManager, mission, jobTitle, address })
			);

			if (coverLetterContent === null) {
				throw new InternalServerError('Failed to generate cover letter');
			}

			await tx.insert(CoverLetters).values({
				content: coverLetterContent,
				userId: user.id,
				jobListing: listingId
			});
		});
	}
);

const updateCoverLetterContent = attemptApi.create(
	async (user: UserUI, coverLetterId: string, content: string) => {
		await db.transaction(async (tx) => {
			const [cl] = await tx.select().from(CoverLetters);

			if (!cl) throw new NotFoundError('Cover Letter not found');
			if (cl.userId !== user.id) throw new UnauthorizedError('Unauthorized');

			await tx
				.update(CoverLetters)
				.set({ content })
				.where(eq(CoverLetters.id, coverLetterId))
				.execute();
		});
	}
);

export const CoverLetterService = {
	generateCoverLetter: generateCoverLetter,
	updateCoverLetterContent: updateCoverLetterContent
};
