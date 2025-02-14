<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { FormState } from '$lib/helpers/formEnhance.svelte';
	import { route } from '$lib/ROUTES';
	import { cn } from '$lib/utils';
	import DeleteResume from './DeleteResume.svelte';
	import ResumeForm from './ResumeForm.svelte';

	let { data, form } = $props();

	let formState = new FormState();
</script>

<main class="mx-auto flex max-w-2xl flex-col gap-4 pt-10">
	<div class="flex items-center justify-end gap-2">
		<ResumeForm />

		<form action={route('test /resumes')} method="POST" use:enhance={formState.submit}>
			<Button type="submit" loading={formState.loading}>Test</Button>
		</form>
	</div>

	<div class="flex flex-col gap-4">
		{#each data.resumes ?? [] as resume}
			<div class="flex justify-between gap-2">
				<h2>{resume.name}</h2>

				<div class={cn('flex gap-2')}>
					<DeleteResume {resume} />
				</div>
			</div>
		{/each}
	</div>

	<div>
		{#if form?.res}
			{JSON.stringify(form?.res, null, 2)}
		{/if}
	</div>
</main>
