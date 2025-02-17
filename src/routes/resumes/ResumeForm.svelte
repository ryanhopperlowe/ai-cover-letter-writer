<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { FormState } from '$lib/helpers/formEnhance.svelte';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';

	let formState = new FormState().onSuccess(() => (open = false));
	let open = $state(false);
</script>

<Dialog.Root {open} onOpenChange={(isOpen) => (open = isOpen)}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props}>
				<Icon icon="lucide:plus" />
				Upload Resume
			</Button>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class="Content">
		<Dialog.Header>
			<Dialog.Title>Upload Resume</Dialog.Title>
		</Dialog.Header>

		<form
			action={route('upload /resumes')}
			class="flex flex-col gap-4"
			method="POST"
			enctype="multipart/form-data"
			use:enhance={formState.submit}
		>
			<Input type="file" name="file" accept="application/pdf" />

			<Button type="submit" loading={formState.loading}>
				<Icon icon="lucide:plus" />
				Add Resume
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
