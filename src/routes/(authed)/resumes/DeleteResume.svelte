<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { FormState } from '$lib/helpers/formEnhance.svelte';
	import { route } from '$lib/ROUTES';
	import type { ResumeUI } from '$lib/server/db/schema/resumes';
	import Icon from '@iconify/svelte';

	let { resume }: { resume: ResumeUI } = $props();

	let formState = new FormState();
</script>

<form action={route('delete /resumes')} method="POST" use:enhance={formState.submit}>
	<input type="hidden" name="id" value={resume.id} />

	<Button type="submit" size="icon" variant="ghost" loading={formState.loading}>
		<Icon icon="lucide:trash" />
	</Button>
</form>
