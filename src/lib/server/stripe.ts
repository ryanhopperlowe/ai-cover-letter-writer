import { STRIPE_API_VERSION, STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';

class StripeClientClass {
	stripe = new Stripe(STRIPE_SECRET_KEY, {
		apiVersion: STRIPE_API_VERSION as Stripe.LatestApiVersion
	});
}

export const stripe = new StripeClientClass().stripe;
