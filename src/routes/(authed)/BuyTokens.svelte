<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { clickoutside } from '$lib/actions/click-outside';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { route } from '$lib/ROUTES';
	import type { UserUI } from '$lib/server/db/schema/users';

	const { user }: { user: UserUI } = $props();

	let loading = $state(false);
	let tokenAmount = $state(1);
	let dialog: HTMLDialogElement | null = null;

	async function handlePurchase() {
		loading = true;

		const response = await fetch(route('POST /api/checkout'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ quantity: tokenAmount })
		});
		const { url } = await response.json();

		loading = false;
		dialog?.close();

		if (url) {
			window.open(url, '_blank');
		}
	}

	$effect(() => {
		const handler = () => invalidate('app:user');
		window.addEventListener('focus', handler);
		return () => window.removeEventListener('focus', handler);
	});
</script>

<Button type="submit" onclick={() => dialog?.showModal()}>Tokens ({user.tokens})</Button>

<dialog bind:this={dialog} class="backdrop:bg-black/50">
	<div class="fixed inset-0 flex items-center justify-center">
		<div class="w-full max-w-md" onclickoutside={() => dialog?.close()} use:clickoutside>
			<Card.Root class="p-6">
				<Card.Header>
					<Card.Title>Purchase Tokens</Card.Title>
					<Card.Description>Each token costs $1.00</Card.Description>
				</Card.Header>

				<Card.Content class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<label for="tokenAmount">Number of Tokens</label>
						<Input
							id="tokenAmount"
							type="number"
							min="1"
							max="20"
							bind:value={tokenAmount}
							class="w-full"
						/>
					</div>

					<div class="text-right">
						<p class="text-lg font-semibold">Total: ${tokenAmount.toFixed(2)}</p>
					</div>
				</Card.Content>

				<Card.Footer class="flex justify-end gap-2">
					<Button variant="outline" onclick={() => dialog?.close()}>Cancel</Button>
					<Button onclick={handlePurchase} {loading}>
						{loading ? 'Processing...' : 'Purchase'}
					</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
</dialog>
