import { handleCreateListing } from '$lib/server/functions/job-listings';
import type { Actions } from '@sveltejs/kit';

export const actions = { default: handleCreateListing } satisfies Actions;
