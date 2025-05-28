import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { Orm } from '../helpers';

export const Users = Orm.table('user', {
	email: Orm.text('email').notNull().unique(),
	passwordHash: Orm.text('password_hash').notNull(),
	tokens: Orm.int('tokens').notNull().default(0)
});

const select = createSelectSchema(Users).omit({ passwordHash: true });
const insert = createInsertSchema(Users)
	.omit({ createdAt: true, updatedAt: true, passwordHash: true })
	.extend({ password: z.string().min(6).max(255) });

export const UsersSchema = { select, insert };

export type User = typeof Users.$inferInsert;
export type UserUI = z.infer<typeof select>;
export type RegisterUser = z.infer<typeof insert>;
