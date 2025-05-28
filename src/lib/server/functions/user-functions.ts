import { db } from '$lib/server/db';
import { Users } from '$lib/server/db/schema/users';
import { decrement, increment } from '$lib/server/db/helpers';
import { eq } from 'drizzle-orm';

const incrementTokens = async (userId: string, amount = 1) => {
	return await db
		.update(Users)
		.set({ tokens: increment(Users.tokens, amount) })
		.where(eq(Users.id, userId))
		.execute();
};

const decrementTokens = async (userId: string, existingTokens: number, amount = 1) => {
	if (existingTokens < amount) throw new Error('Cannot consume more tokens than available');

	return await db
		.update(Users)
		.set({ tokens: decrement(Users.tokens, amount) })
		.where(eq(Users.id, userId))
		.execute();
};

export const UserService = { incrementTokens: incrementTokens, decrementTokens: decrementTokens };
