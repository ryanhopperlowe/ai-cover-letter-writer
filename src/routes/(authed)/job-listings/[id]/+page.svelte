<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { markdown } from '$lib/helpers/micromark.js';
	import { route } from '$lib/ROUTES';
	import type { CoverLetterUI } from '$lib/server/db/schema/cover-letters.js';
	import { handlePromise } from '$lib/utils/handlePromise.js';
	import Icon from '@iconify/svelte';

	let { data, form } = $props();
	let { listing, resumes, coverLetters } = data;

	let checked = $state<string[]>([]);
	let loading = $state(false);

	let deletingCl = $state<string | null>(null);

	let copied = $state<string | null>(null);
	$effect(() => {
		if (!copied) return;

		const timeout = setTimeout(() => {
			copied = null;
		}, 6000);

		return () => clearTimeout(timeout);
	});

	async function handleCopy(cl: CoverLetterUI) {
		const [err] = await handlePromise(navigator.clipboard.writeText(cl.content));

		if (err) {
			console.error(err);
			return;
		}

		copied = cl.id;
	}
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

		<Button type="submit" disabled={loading} {loading}>Create Cover Letters</Button>

		{#if form?.errors.form.length}
			<p class="text-red-500">{form.errors.form[0]}</p>
		{/if}
	</form>

	<h3>Cover Letters</h3>

	<Accordion type="single">
		{#each coverLetters as cl, i}
			<AccordionItem>
				<AccordionTrigger class="group">
					<div class="flex items-center gap-2">
						Cover letter #{i + 1}

						<span class="invisible flex items-center gap-2 group-hover:visible">
							<Button
								variant="ghost"
								size="icon"
								onclick={(e) => {
									e.stopPropagation();
									handleCopy(cl);
								}}
							>
								{#if copied === cl.id}
									<Icon icon="lucide:check" class="text-green-500" />
								{:else}
									<Icon icon="lucide:copy" />
								{/if}
							</Button>

							<form
								action={route('deleteCoverLetter /job-listings/[id]', { id: listing.id })}
								method="post"
								use:enhance={() => {
									deletingCl = cl.id;
									return ({ update }) => update().then(() => (deletingCl = null));
								}}
							>
								<input type="hidden" name="id" value={cl.id} />

								<Button
									variant="ghost"
									size="icon"
									type="submit"
									onclick={(e) => e.stopPropagation()}
									loading={deletingCl === cl.id}
									disabled={!!deletingCl}
								>
									<Icon icon="lucide:trash" />
								</Button>
							</form>
						</span>
					</div>
				</AccordionTrigger>

				<AccordionContent>
					{@html markdown(cl.content)}
				</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
