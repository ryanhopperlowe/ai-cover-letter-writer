import { PUBLIC_APP_URL } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { Carts } from '$lib/server/db/schema/cart';
import { TOKEN_PRODUCT_ID } from '$env/static/private';
import { eq } from 'drizzle-orm';
import { attempt } from '@ryact-utils/attempt';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { quantity } = z.object({ quantity: z.number() }).parse(await request.json());

	const cartResp = await attempt(
		db.insert(Carts).values({ userId: locals.user.id, tokens: quantity }).returning().execute()
	);

	if (cartResp.error) return Response.json({ error: 'Failed to create cart' }, { status: 500 });

	const [{ id: cartId }] = cartResp.data;

	const [error, session] = await attempt.promise(
		stripe.checkout.sessions.create({
			mode: 'payment',
			client_reference_id: cartId,
			automatic_tax: { enabled: true },
			success_url: `${PUBLIC_APP_URL}/success/${cartId}`,
			cancel_url: undefined,
			line_items: [
				{
					quantity,
					price_data: {
						product: TOKEN_PRODUCT_ID,
						unit_amount: 100,
						currency: 'usd'
					}
				}
			]
		})
	);

	if (error) {
		return Response.json({ error: error.message }, { status: 500 });
	}

	if (!session.url) {
		return Response.json({ error: 'Failed to create stripe session URL' }, { status: 500 });
	}

	const [sessionErr] = await attempt.promise(
		db.update(Carts).set({ checkoutSessionId: session.id }).where(eq(Carts.id, cartId)).execute()
	);

	if (sessionErr)
		return Response.json({ error: 'Failed to upddate cart with session Id' }, { status: 500 });

	return Response.json({ url: session.url });
};
