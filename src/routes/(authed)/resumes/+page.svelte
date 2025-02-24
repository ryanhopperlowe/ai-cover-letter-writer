<script lang="ts">
	import { cn } from '$lib/utils';
	import DeleteResume from './DeleteResume.svelte';
	import ResumeForm from './ResumeForm.svelte';

	let { data } = $props();
</script>

<main class="mx-auto flex max-w-2xl flex-col gap-4 pt-10">
	<div class="flex items-center justify-end gap-2">
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
