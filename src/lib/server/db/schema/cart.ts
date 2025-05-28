import { Orm } from '../helpers';
import { Users } from './users';

export const Carts = Orm.table('cart', {
	userId: Orm.uuid()
		.notNull()
		.references(() => Users.id),
	checkoutSessionId: Orm.text(),
	tokens: Orm.int().notNull(),
	completed: Orm.boolean().notNull().default(false)
});
