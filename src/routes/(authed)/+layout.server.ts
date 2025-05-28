import { db } from '$lib/server/db';
import { Users, UsersSchema } from '$lib/server/db/schema/users';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	depends('app:user');

	if (!locals.user) {
		return { user: null };
	}

	const [user] = await db.select().from(Users).where(eq(Users.id, locals.user.id));

	return { user: UsersSchema.select.parse(user) };
};
