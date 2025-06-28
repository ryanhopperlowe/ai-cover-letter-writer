<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import { route } from '$lib/ROUTES';
	import type { CoverLetterUI } from '$lib/server/db/schema/cover-letters';

	import { page } from '$app/state';
	import { submitOnCmdEnter } from '$lib/actions/formSubmit';
	import type { ActionData } from './$types';

	type Props = {
		coverLetter: CoverLetterUI;
		listingId: string;
		formId: string;
		loading?: boolean;
	};

	let { coverLetter, listingId, formId, loading = $bindable() }: Props = $props();

	const error = $derived.by(() => {
		const form = page.form as ActionData;

		if (form?.action !== 'updateCoverLetter') return;
		if (form.coverLetterId !== coverLetter.id) return;

		return form.errors.form[0];
	});

	let content = $state(coverLetter.content);
</script>

<form
	{@attach submitOnCmdEnter()}
	id={formId}
	action={route('updateCoverLetter /job-listings/[id]', { id: listingId })}
	method="post"
	use:enhance={() => {
		loading = true;
		return ({ update }) => update().finally(() => (loading = false));
	}}
>
	{#if error}
		<p class="color-red">{error}</p>
	{/if}

	<input type="hidden" value={coverLetter.id} name="id" />
	<MarkdownEditor defaultValue={coverLetter.content} bind:value={content} name="content" />
</form>
