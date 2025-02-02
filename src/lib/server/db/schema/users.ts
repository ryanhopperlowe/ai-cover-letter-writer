import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { Orm } from './../helpers';

const table = Orm.table('user', {
	email: Orm.text('email').notNull().unique()
});

const select = createSelectSchema(table);
const insert = createInsertSchema(table).omit({ createdAt: true, updatedAt: true });
const update = insert.partial();

export type User = z.infer<typeof select>;
export type CreateUser = z.infer<typeof insert>;
export type UpdateUser = z.infer<typeof update>;

export const Users = {
	table,
	select,
	insert,
	update
};
