<script lang="ts">
	import { StripeClient } from '$lib/client/stripe.svelte';

	const stripe = new StripeClient();
</script>

<div>
	{#if stripe.loading}
		<p>Loading...</p>
	{:else}
		<p>Loaded</p>
	{/if}
</div>
