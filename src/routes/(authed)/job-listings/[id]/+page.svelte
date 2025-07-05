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
	import { route } from '$lib/ROUTES';
	import type { CoverLetterUI } from '$lib/server/db/schema/cover-letters.js';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { attempt } from '@ryact-utils/attempt';
	import CoverLetterAccordion from './CoverLetterAccordion.svelte';
	import { jsPDF } from 'jspdf';
	import { markdown } from '$lib/helpers/micromark';
	import { fromAction } from 'svelte/attachments';

	let { data, form } = $props();
	let { listing, resumes, coverLetters } = data;

	let checked = $state<string[]>([]);
	let loading = $state(false);

	let deletingCl = $state<string | null>(null);
	let loadingMap = $state<Record<string, boolean>>({});
	let downloading = $state<string | null>(null);

	let copied = $state<string | null>(null);
	$effect(() => {
		if (!copied) return;

		const timeout = setTimeout(() => {
			copied = null;
		}, 6000);

		return () => clearTimeout(timeout);
	});

	function downloadFile(
		data: BlobPart,
		filename: string,
		mimeType: string = 'application/octet-stream'
	): void {
		const blob = new Blob([data], { type: mimeType });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();

		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 0);
	}

	async function handleCopy(cl: CoverLetterUI) {
		const [err] = await attempt(navigator.clipboard.writeText(cl.content));

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
			return ({ update }) => update().finally(() => (loading = false));
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

		{#if form?.errors?.form.length}
			<p class="text-red-500">{form.errors.form[0]}</p>
		{/if}
	</form>

	<h3>Cover Letters</h3>

	<Accordion type="single">
		{#each coverLetters as cl, i}
			{@const formId = `update-${cl.id}`}

			<AccordionItem class="group relative">
				<AccordionTrigger class="sticky top-0">
					<div class="flex items-center gap-2">
						Cover letter #{i + 1}

						<span class={cn('invisible flex items-center gap-2 group-hover:visible')}>
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
									return ({ update }) => update().finally(() => (deletingCl = null));
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

							<Button
								form={formId}
								type="submit"
								size="icon"
								variant="ghost"
								onclick={(e) => e.stopPropagation()}
								loading={loadingMap[cl.id]}
							>
								<Icon icon="lucide:save" />
							</Button>

							<form
								action={route('downloadCoverLetter /job-listings/[id]', { id: data.listing.id })}
								method="POST"
								use:enhance={() => {
									downloading = cl.id;
									return ({ update }) => {
										downloading = null;
										return update();
									};
								}}
							>
								<input type="hidden" name="id" value={cl.id} />
								<Button type="submit" size="icon" variant="ghost" loading={downloading === cl.id}>
									<Icon icon="lucide:download" />
								</Button>
								{#if form?.action === 'download' && form.errors.form.length}
									<p class="text-red-500">{form.errors.form[0]}</p>
								{/if}
							</form>
						</span>
					</div>
				</AccordionTrigger>

				<AccordionContent class="overflow-visible">
					<CoverLetterAccordion
						coverLetter={cl}
						{formId}
						listingId={listing.id}
						bind:loading={loadingMap[cl.id]}
					/>
				</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
