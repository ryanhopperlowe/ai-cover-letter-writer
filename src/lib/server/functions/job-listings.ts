import { route } from '$lib/ROUTES';
import { db } from '$lib/server/db';
import { CoverLetters } from '$lib/server/db/schema/cover-letters';
import { JobListings, JobListingShema } from '$lib/server/db/schema/job-listings';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const handleCreateListing = async ({ request, locals }: RequestEvent) => {
	const formData = Object.fromEntries(await request.formData());
	const parsed = JobListingShema.insert.omit({ userId: true }).safeParse(formData);

	if (!locals.user?.id) {
		return fail(401, { data: parsed.data, unauthorized: true });
	}

	if (!parsed.success)
		return fail(400, {
			data: parsed.data,
			errors: {
				validation: parsed.error.flatten().fieldErrors,
				form: parsed.error.flatten().formErrors
			}
		});

	await db.insert(JobListings).values({ ...parsed.data, userId: locals.user.id });

	redirect(302, route('/job-listings'));
};

export const handleDeleteListing = async ({ request, locals }: RequestEvent) => {
	if (!locals.user?.id) {
		redirect(302, route('/login'));
	}

	const parsed = JobListingShema.select
		.pick({ id: true })
		.safeParse(Object.fromEntries(await request.formData()));

	if (!parsed.success) {
		const validation = parsed.error.flatten();
		return fail(400, { validation });
	}

	const { id } = parsed.data;

	const [listing] = await db.select().from(JobListings).where(eq(JobListings.id, id));

	if (!listing) {
		return fail(404, { error: 'Listing not found' });
	}

	if (listing.userId !== locals.user.id) {
		return fail(403, { error: 'Forbidden' });
	}

	await db.delete(CoverLetters).where(eq(CoverLetters.jobListing, id));

	await db.delete(JobListings).where(eq(JobListings.id, id));

	return { ...parsed };
};

const getListing = async (id: string) => {
	return (await db.select().from(JobListings).where(eq(JobListings.id, id))).at(1) ?? null;
};

export const ListingService = { getListing: getListing };
