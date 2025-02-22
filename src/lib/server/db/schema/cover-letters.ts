import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Orm } from '../helpers';
import { JobListings } from './job-listings';
import { Users } from './users';

export const CoverLetters = Orm.table('cover_letter', {
	content: Orm.text().notNull(),

	jobListing: Orm.uuid().references(() => JobListings.id),
	userId: Orm.uuid()
		.notNull()
		.references(() => Users.id),
	copiedFromId: Orm.uuid()
});

const select = createSelectSchema(CoverLetters);
const insert = createInsertSchema(CoverLetters).omit({ createdAt: true, updatedAt: true });
const update = insert.omit({ userId: true, id: true });

export const CoverLettersSchema = { select, insert, update };

export type CoverLetter = typeof CoverLetters.$inferSelect;
export type CoverLetterUI = z.infer<typeof select>;
export type CreateCoverLetter = z.infer<typeof insert>;
export type UpdateCoverLetter = z.infer<typeof update>;
