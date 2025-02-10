import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { Orm } from '../helpers';
import type { z } from 'zod';
import { Users } from './users';

export const Resumes = Orm.table('resume', {
	name: Orm.text().notNull(),
	tags: Orm.text(),
	bucketPath: Orm.text().notNull(),
	userId: Orm.uuid()
		.notNull()
		.references(() => Users.id)
});

const select = createSelectSchema(Resumes);
const insert = createInsertSchema(Resumes).omit({ createdAt: true, updatedAt: true });
const update = insert.partial();

export type Resume = typeof Resumes.$inferInsert;
export type ResumeUI = z.infer<typeof select>;

export type CreateResume = z.infer<typeof insert>;
export type UpdateResume = z.infer<typeof update>;

export const ResumesSchema = { select, insert, update };
