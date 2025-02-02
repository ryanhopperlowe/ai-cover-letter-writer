import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { Orm } from '../helpers';
import type { z } from 'zod';

const table = Orm.table('resume', {
	name: Orm.text().notNull(),
	tags: Orm.text(),
	bucketPath: Orm.text().notNull()
});

const select = createSelectSchema(table);
const insert = createInsertSchema(table).omit({ createdAt: true, updatedAt: true });
const update = insert.partial();

export type Resume = z.infer<typeof select>;
export type CreateResume = z.infer<typeof insert>;
export type UpdateResume = z.infer<typeof update>;

export const Resumes = {
	table,
	select,
	insert,
	update
};
