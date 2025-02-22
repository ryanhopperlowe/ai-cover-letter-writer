<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		AccordionContent,
		AccordionTrigger,
		Accordion,
		AccordionItem
	} from '$lib/components/ui/accordion';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { route } from '$lib/ROUTES';
	import { handlePromise } from '$lib/utils/handlePromise.js';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	let { listing, resumes, coverLetters } = data;

	let checked = $state<string[]>([]);
	let loading = $state(false);

	let deletingCl = $state<string | null>(null);

	let copied = $state(false);
	$effect(() => {
		if (!copied) return;

		const timeout = setTimeout(() => {
			copied = false;
		}, 6000);

		return () => clearTimeout(timeout);
	});

	async function handleCopy(text: string) {
		const [err] = await handlePromise(navigator.clipboard.writeText(text));

		if (err) {
			console.error(err);
			return;
		}

		copied = true;
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

		<Button type="submit" {loading}>Create Cover Letters</Button>
	</form>

	<h3>Cover Letters</h3>

	<Accordion type="single">
		{#each coverLetters as cl, i}
			<AccordionItem>
				<AccordionTrigger class="group">
					<div class="flex items-center gap-2">
						Cover letter #{i + 1}

						<span class="invisible flex items-center gap-2 group-hover:visible">
							<Button variant="ghost" size="icon" onclick={() => handleCopy(cl.content)}>
								<Icon icon="lucide:copy" />
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
					{cl.content}
				</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
