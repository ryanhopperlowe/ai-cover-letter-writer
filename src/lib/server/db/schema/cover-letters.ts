import { relations } from 'drizzle-orm';
import { Orm } from '../helpers';
import { JobListings } from './job-listings';
import { Resumes } from './resumes';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { Users } from './users';
import { z } from 'zod';

export const CoverLetters = Orm.table('cover_letter', {
	content: Orm.text().notNull(),

	jobListing: Orm.uuid().references(() => JobListings.id),
	userId: Orm.uuid()
		.notNull()
		.references(() => Users.id)
});

export const CoverLetterRelations = relations(CoverLetters, ({ many }) => ({
	resumes: many(Resumes)
}));

const select = createSelectSchema(CoverLetters);
const insert = createInsertSchema(CoverLetters).omit({ createdAt: true, updatedAt: true });
const update = insert.omit({ userId: true, id: true }).extend({
	resumesIds: z.string().uuid().array()
});

export const CoverLettersSchema = { select, insert, update };

export type CoverLetter = typeof CoverLetters.$inferSelect;
export type CoverLetterUI = z.infer<typeof select>;
export type CreateCoverLetter = z.infer<typeof insert>;
export type UpdateCoverLetter = z.infer<typeof update>;
