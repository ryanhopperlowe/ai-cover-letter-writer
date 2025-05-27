import { db } from '$lib/server/db';
import { increment } from '$lib/server/db/helpers';
import { Carts } from '$lib/server/db/schema/cart';
import { Users } from '$lib/server/db/schema/users';
import { handlePromise } from '$lib/utils/handlePromise';
import { eq } from 'drizzle-orm';
import { stripe } from '$lib/server/stripe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { cartId } = params;

	const [cart] = await db.select().from(Carts).where(eq(Carts.id, cartId));

	if (!cart) return { error: 'Cart not found' };

	if (!cart.checkoutSessionId) return { error: 'Cart checkout session not found' };

	if (cart.completed) return { error: 'Tokens have already been redeemed' };

	const session = await stripe.checkout.sessions.retrieve(cart.checkoutSessionId);
	if (session.status !== 'complete') return { error: 'Checkout session incomplete' };

	const [completeErr] = await handlePromise(
		Promise.all([
			db.update(Carts).set({ completed: true }).where(eq(Carts.id, cartId)).execute(),
			db
				.update(Users)
				.set({ tokens: increment(Users.tokens, cart.tokens) })
				.where(eq(Users.id, cart.userId))
				.execute()
		])
	);

	if (completeErr) return { error: 'Something went wrong, please try again' };

	return { success: true };
};
