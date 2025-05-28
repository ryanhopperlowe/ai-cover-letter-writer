import { handleCreateListing, handleDeleteListing } from '$lib/server/functions/job-listings';
import { route } from '$lib/ROUTES';
import { db } from '$lib/server/db';
import { JobListings, JobListingShema } from '$lib/server/db/schema/job-listings';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, route('/login'));
	}

	const listings = await db
		.select()
		.from(JobListings)
		.where(eq(JobListings.userId, locals.user.id));

	return { listings: listings.map((l) => JobListingShema.select.parse(l)) };
};

export const actions = {
	create: handleCreateListing,
	delete: handleDeleteListing
} satisfies Actions;
