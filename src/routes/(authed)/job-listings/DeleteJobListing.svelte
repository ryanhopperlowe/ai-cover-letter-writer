<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';

	let { id }: { id: string } = $props();
	let loading = $state(false);
</script>

<form
	action={route('delete /job-listings')}
	method="post"
	use:enhance={() => {
		loading = true;
		return ({ update }) => update().then(() => (loading = false));
	}}
>
	<input type="hidden" value={id} name="id" />
	<Button {loading} variant="ghost" size="icon" aria-busy={loading} type="submit"
		><Icon icon="lucide:trash" /></Button
	>
</form>
