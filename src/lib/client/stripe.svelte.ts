import { PUBLIC_STRIPE_CLIENT_ID } from '$env/static/public';
import { loadStripe, type Stripe } from '@stripe/stripe-js';

export class StripeClient {
	loading = $state(false);
	client = $state<Stripe | null>(null);

	constructor() {
		loadStripe(PUBLIC_STRIPE_CLIENT_ID).then((stripe) => {
			this.client = stripe;
			this.loading = false;
		});
	}
}
