<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { route } from '$lib/ROUTES';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import DeleteJobListing from './DeleteJobListing.svelte';

	let { data } = $props();
</script>

<div class="mb-4 flex justify-end gap-2">
	<Button href={route('/job-listings/create')}><Icon icon="lucide:plus" /> Create Listing</Button>
</div>

<div class="flex flex-col gap-4">
	{#each data.listings ?? [] as { companyName, id }}
		<div class="flex justify-between gap-2">
			<h2>{companyName}</h2>

			<div class={cn('flex gap-2')}>
				<DeleteJobListing {id} />
			</div>
		</div>
	{/each}
</div>
