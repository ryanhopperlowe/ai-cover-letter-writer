import { Orm } from '../helpers';

export const product = Orm.table('product', {
	name: Orm.text('name').notNull().unique(),
	description: Orm.text('description').notNull(),
	price: Orm.float('price').notNull(),
	image: Orm.text('image').notNull(),
	stripeProductId: Orm.text('stripe_product_id').notNull().unique(),
	stripePriceId: Orm.text('stripe_price_id').notNull().unique()
});
