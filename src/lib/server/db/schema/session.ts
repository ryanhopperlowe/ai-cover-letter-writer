import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Users } from './users';

export const Sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => Users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof Sessions.$inferSelect;
export type CreateSession = typeof Sessions.$inferInsert;
