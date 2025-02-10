<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';
	import ResumeForm from './ResumeForm.svelte';
	import { cn } from '$lib/utils';
	import DeleteResume from './DeleteResume.svelte';

	let { data } = $props();
</script>

<main class="mx-auto flex max-w-2xl flex-col gap-4 pt-10">
	<div class="flex justify-end">
		<ResumeForm />
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
</main>
