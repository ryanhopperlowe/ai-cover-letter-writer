<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex h-screen justify-center pt-20">
	<div class="flex w-full max-w-2xl flex-col gap-4">
		<h1 class="text-2xl font-bold">Login/Register</h1>

		<form method="post" action="?/login" use:enhance class="flex flex-col gap-4">
			<label>
				Username
				<Input name="username" />
			</label>

			<label>
				Password
				<Input type="password" name="password" />
			</label>

			<nav class="flex flex-row-reverse gap-4">
				<Button type="submit">Login</Button>
				<Button variant="outline" type="submit" formaction="?/register">Register</Button>
			</nav>
		</form>
		<p style="color: red;">{form?.message ?? ''}</p>
	</div>
</div>
