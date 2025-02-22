<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	let { form } = $props();
	let loading = $state(false);
</script>

<form
	method="post"
	class="flex flex-col gap-4"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => update().then(() => (loading = false));
	}}
>
	<div class="flex w-full gap-2">
		<div class="flex-1">
			<Label for="companyName">Company Name</Label>
			<Input name="companyName" value={form?.data?.companyName ?? ''} />
			<p class="text-red-500">{form?.errors?.validation.companyName}</p>
		</div>

		<div class="flex-1">
			<Label for="title">Job Title</Label>
			<Input name="title" value={form?.data?.title ?? ''} />
			<p class="text-red-500">{form?.errors?.validation.title}</p>
		</div>
	</div>

	<div>
		<Label for="hiringManager">Hiring Manager (optional)</Label>
		<Input name="hiringManager" value={form?.data?.hiringManager ?? ''} />
		<p class="text-red-500">{form?.errors?.validation.hiringManager}</p>
	</div>

	<div>
		<Label for="address">Address (optional)</Label>
		<Input name="address" value={form?.data?.address ?? ''} />
		<p class="text-red-500">{form?.errors?.validation.hiringManager}</p>
	</div>

	<div>
		<Label for="content">Listing Text</Label>
		<Textarea name="content" value={form?.data?.content} />
		<p class="text-red-500">{form?.errors?.validation.content}</p>
	</div>

	<Button type="submit" {loading} aria-busy={loading}>Submit</Button>

	<p class="text-red-500">{form?.errors?.form[0]}</p>
</form>
