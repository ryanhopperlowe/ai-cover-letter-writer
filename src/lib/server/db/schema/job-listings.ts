import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Orm } from '../helpers';
import { Users } from './users';

export const JobListings = Orm.table('job_listing', {
	title: Orm.text().notNull(),
	companyName: Orm.text().notNull(),
	content: Orm.text().notNull(),
	hiringManager: Orm.text(),
	mission: Orm.text(),
	address: Orm.text(),

	userId: Orm.uuid()
		.notNull()
		.references(() => Users.id)
});

const select = createSelectSchema(JobListings);
const insert = createInsertSchema(JobListings, {
	title: z.string().min(1, 'Required').max(30),
	companyName: z.string().min(1, 'Required').max(30),
	content: z.string().min(1, 'Required'),
	hiringManager: z.string().max(30).optional(),
	mission: z.string().optional(),
	address: z.string().optional()
}).omit({
	createdAt: true,
	updatedAt: true
});
const update = insert.omit({ id: true, userId: true });

export const JobListingShema = { select, insert, update };

export type JobListing = typeof JobListings.$inferSelect;
export type JobListingUI = z.infer<typeof select>;
export type CreateJobListing = z.infer<typeof insert>;
export type UpdateJobListing = z.infer<typeof update>;
