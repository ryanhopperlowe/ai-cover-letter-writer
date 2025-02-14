import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { Orm } from '../helpers';
import type { z } from 'zod';
import { Users } from './users';

export const JobListings = Orm.table('job_listing', {
	companyName: Orm.text().notNull(),
	jobDescription: Orm.text().notNull(),
	hiringManager: Orm.text(),
	mission: Orm.text(),

	userId: Orm.uuid()
		.notNull()
		.references(() => Users.id)
});

const select = createSelectSchema(JobListings);
const insert = createInsertSchema(JobListings).omit({
	createdAt: true,
	updatedAt: true
});
const update = insert.omit({ id: true, userId: true });

export const JobListingShema = { select, insert, update };

export type JobListing = typeof JobListings.$inferInsert;
export type JobListingUI = z.infer<typeof select>;
export type CreateJobListing = z.infer<typeof insert>;
export type UpdateJobListing = z.infer<typeof update>;
