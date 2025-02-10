<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<main class="flex justify-center pt-20">
	<Card.Root class="flex w-full max-w-2xl flex-col gap-4">
		<Card.Header>
			<Card.Title>Login/Register</Card.Title>
		</Card.Header>

		<Card.Content class="Content">
			<form method="post" action="?/login" use:enhance class="flex flex-col gap-4">
				<label>
					Username
					<Input name="username" />
				</label>

				<label>
					Password
					<Input type="password" name="password" />
				</label>

				<p style="color: red;">{form?.message ?? ''}</p>

				<nav class="flex flex-row-reverse gap-4">
					<Button type="submit">Login</Button>
					<Button variant="outline" type="submit" formaction="?/register">Register</Button>
				</nav>
			</form>
		</Card.Content>
	</Card.Root>
</main>
