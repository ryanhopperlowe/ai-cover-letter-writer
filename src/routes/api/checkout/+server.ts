import { stripe } from '$lib/server/stripe';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{
				price_data: {
					product: 'prod_RqGuDVzmAufODI',
					currency: 'usd'
				}
			}
		]
	});

	if (!session.url) {
		return Response.json({ error: 'Failed to create stripe session' }, { status: 500 });
	}

	return Response.json(session.url);
};
