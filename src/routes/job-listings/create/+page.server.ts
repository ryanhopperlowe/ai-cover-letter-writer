import { handleCreateListing } from '$lib/actions/job-listings';
import type { Actions } from '@sveltejs/kit';

export const actions = { default: handleCreateListing } satisfies Actions;
