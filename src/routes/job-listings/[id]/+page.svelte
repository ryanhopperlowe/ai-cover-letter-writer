<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { route } from '$lib/ROUTES';

	let { data } = $props();
	let { listing, resumes } = data;

	let checked = $state<string[]>([]);
	let loading = $state(false);
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Cover Letters</h1>

	<form
		action={route('createCoverLetter /job-listings/[id]', { id: listing.id })}
		method="post"
		class="flex flex-col gap-4"
		use:enhance={() => {
			loading = true;
			return ({ update }) => update().then(() => (loading = false));
		}}
	>
		{#each resumes as resume}
			<div class="flex flex-row items-center gap-2">
				<Checkbox
					name="resumeIds"
					id={resume.id}
					checked={checked.includes(resume.id)}
					value={resume.id}
				/>
				<Label for={resume.id}>{resume.name}</Label>
			</div>
		{/each}

		<Button type="submit" {loading}>Create Cover Letters</Button>
	</form>
</div>
